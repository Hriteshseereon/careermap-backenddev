import { sendOTPViaTwilio, verifyOTPViaTwilio } from "../../lib/twilio.js";
import jwt from "jsonwebtoken";
import {AuthRepository} from "../auth/auth.repository.js";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import {generateTokens,generateTempToken} from "../../utils/helpers.js";
import { UserRepository } from "../user/user.repository.js";



// ----------------------------------------------------------------------------
// OTP configuration
//   OTP_DELIVERY=response (default) → OTP is generated here and returned in the
//       send-otp response (SMS is switched off; both apps show it in a popup).
//       ⚠️ Anyone who knows a mobile number can then obtain its OTP. Testing only.
//   OTP_DELIVERY=sms → OTP is sent and verified through Twilio Verify (lib/twilio.js);
//       it is never returned in the response nor written to the logs.
//   MASTER_OTP → optional fixed code accepted for every account (testing only).
//       When unset (the default) there is no master OTP.
// The OTP store is in-memory: with more than one server instance, send-otp and
// verify-otp must reach the same instance (sticky sessions) or use a shared store.
// ----------------------------------------------------------------------------
const OTP_DELIVERY =
  String(process.env.OTP_DELIVERY || "response").trim().toLowerCase() === "sms"
    ? "sms"
    : "response";
const MASTER_OTP = String(process.env.MASTER_OTP || "").trim() || null;
const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

if (OTP_DELIVERY === "response") {
  console.warn(
    "⚠️  [SECURITY] OTP_DELIVERY=response: OTPs are returned in the /api/auth/send-otp response. " +
      "Anyone who knows a mobile number can log in as that user. Set OTP_DELIVERY=sms in production."
  );
}
if (MASTER_OTP) {
  console.warn(
    "⚠️  [SECURITY] MASTER_OTP is set: that code is accepted for every account. Unset it in production."
  );
}

// In-memory OTP store (mobile -> { otp, expiresAt, attempts })
const otpStore = new Map();

const safeEqual = (a, b) => {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

// Never send credential material to a client.
const toSafeUser = (user) => {
  if (!user || typeof user !== "object") return user;
  const { password, resetToken, resetTokenExpiry, ...safe } = user;
  return safe;
};

// helper for profile update check
const isProfileComplete = (user) => {
  return !!(
    user.firstName &&
    user.lastName &&
    user.mobile &&
    user.gender &&
    user.country &&
    user.state &&
    user.city &&
    user.address &&
    user.dataOfBirth &&
    user.image
  );
};

export const otpService = async (mobile, type) => {
  try {
    if (!mobile) {
      throw new Error("Mobile number is required");
    }
    if (!type) {
      throw new Error("Type is required (login/signup)");
    }

    const mobileKey = String(mobile);

    // Check if already registered
    const existingUser = await AuthRepository.findByMobile(mobileKey);

    if (type === "signup" && existingUser) {
      throw new Error("User already registered. Please login.");
    }
    if (type === "login" && !existingUser) {
      throw new Error("User not found. Please signup.");
    }

    if (OTP_DELIVERY === "sms") {
      // Twilio Verify generates, sends and checks the code. We only track wrong attempts.
      await sendOTPViaTwilio(mobileKey);
      otpStore.set(mobileKey, {
        otp: null,
        expiresAt: Date.now() + OTP_TTL_MS,
        attempts: 0,
      });

      return {
        success: true,
        message: "OTP sent successfully",
      };
    }

    // Generate 6-digit dynamic OTP (valid for 10 mins)
    const generatedOtp = crypto.randomInt(100000, 1000000).toString();
    otpStore.set(mobileKey, {
      otp: generatedOtp,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
    });

    console.log(`\n========================================`);
    console.log(`🔥 [OTP GENERATED] Mobile: ${mobileKey} | OTP: ${generatedOtp}`);
    console.log(`========================================\n`);

    return {
      success: true,
      message: "OTP sent successfully",
      otp: generatedOtp, // 🔥 Returned for the in-app popup (OTP_DELIVERY=response only)
    };
  } catch (error) {
    console.error("OTP Service Error:", error?.message || error);
    return { success: false, message: error.message || "Failed to send OTP" };
  }
};

const INVALID_OTP = {
  success: false,
  message: "Invalid or expired OTP. Please try again.",
};

// Returns true when `code` is correct for `mobileKey`; counts wrong attempts and
// invalidates the pending code after MAX_OTP_ATTEMPTS wrong tries (a new send-otp is then needed).
const checkOtp = async (mobileKey, code) => {
  const stored = otpStore.get(mobileKey);

  if (stored && stored.expiresAt <= Date.now()) {
    otpStore.delete(mobileKey);
  }
  const pending = otpStore.get(mobileKey);

  // Too many wrong codes: this OTP is dead until the user requests a new one.
  if (pending?.locked) {
    return false;
  }

  if (MASTER_OTP && pending && safeEqual(code, MASTER_OTP)) {
    return true;
  }

  let valid = false;
  if (OTP_DELIVERY === "sms") {
    // Twilio Verify also enforces its own attempt limit per verification, so the
    // check still works if this instance did not see the send-otp call (restart / multi-instance).
    const result = await verifyOTPViaTwilio(mobileKey, code);
    valid = Boolean(result?.valid);
  } else {
    valid = Boolean(pending && pending.otp && safeEqual(pending.otp, code));
  }

  if (!valid && pending) {
    pending.attempts += 1;
    if (pending.attempts >= MAX_OTP_ATTEMPTS) {
      // brute-force protection: invalidate the code (kept as a lock marker until it expires)
      pending.otp = null;
      pending.locked = true;
    }
  }

  return valid;
};

export const verifyOTPService = async (mobile, code, type) => {
  try {
    const mobileKey = String(mobile);
    const codeStr = String(code).trim();

    const isValid = await checkOtp(mobileKey, codeStr);

    if (!isValid) {
      return INVALID_OTP;
    }

    // Clean up used OTP
    otpStore.delete(mobileKey);

    // ✅ Handle signup vs login separately
    if (type === "signup") {
      // 🔥 generate temp token
      const tempToken = generateTempToken(mobileKey);

      return {
        success: true,
        message: "Mobile verified successfully. Proceed to signup.",
        tempToken, // ✅ send token
      };
    }

    if (type === "login") {
      const user = await AuthRepository.findByMobile(mobileKey);
      if (!user) {
        return { success: false, message: "User not found. Please signup." };
      }
      // 🔥 BAN CHECK
      if (user.status === "banned") {
        return {
          success: false,
          message: "Your account has been banned. Contact support.",
        };
      }
      const tokens = generateTokens(user);
      return { success: true, message: "Login successful", user: toSafeUser(user), ...tokens };
    }

    return { success: false, message: "Invalid type" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


// login with email and password

export const loginWithEmailPassword = async (email, password) => {
  try {
    const user = await UserRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.status === "banned") {
  throw new Error(
    "Your account has been banned. Contact support."
  );
}

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const profileIncomplete = user.isInstituteStudent && !isProfileComplete(user);

    const tokens = generateTokens(user);
    return { success: true, message: "Login successful",
         user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    status: user.status,
    isInstituteStudent: user.isInstituteStudent,
    instituteId: user.instituteId,
  },
       profileIncomplete, 
      ...tokens };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
