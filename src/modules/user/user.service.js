import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../../utils/mailer.js";
import { UserRepository } from "./user.repository.js";
import crypto from "crypto";
import { generateTokens } from "../../utils/helpers.js";

// Profile fields the web portal and mobile app send on signup (ProfileSetupPage / profile-setup).
const SIGNUP_PROFILE_FIELDS = [
  "country",
  "state",
  "city",
  "district",
  "gender",
  "address",
  "dataOfBirth",
  "image",
];

// Never send credential material to a client.
export const toSafeUser = (user) => {
  if (!user || typeof user !== "object") return user;
  const { password, resetToken, resetTokenExpiry, ...safe } = user;
  return safe;
};

// Short fingerprint of the current password hash. Embedded in the reset JWT so the
// link stops working as soon as the password changes (single use), without changing the link format.
const passwordFingerprint = (passwordHash) =>
  crypto.createHash("sha256").update(String(passwordHash || "")).digest("hex").slice(0, 16);

export const registerUser = async (body, mobileFromToken) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    landingData,
  } = body || {};

  // Security: only the profile fields the web and mobile signup forms send are accepted.
  // Anything else (isInstituteStudent, instituteId, isupgraded, role-like fields...) is ignored,
  // and the mobile number always comes from the verified OTP temp token.
  const profileFields = {};
  for (const key of SIGNUP_PROFILE_FIELDS) {
    if (body?.[key] !== undefined) {
      profileFields[key] = body[key];
    }
  }
  // Both apps send status "Active"; keep storing exactly that, but never let signup set any other status.
  if (typeof body?.status === "string" && body.status.trim().toLowerCase() === "active") {
    profileFields.status = body.status;
  }

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  // ✅ Check email only (mobile already verified via OTP)
  const existingUser = await UserRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  // ✅ Double safety: check mobile again
  const existingMobile = await UserRepository.findByMobile(mobileFromToken);
  if (existingMobile) {
    throw new Error("Mobile already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const newUser = await UserRepository.createUserWithLandingData(
    {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      ...profileFields,
      mobile: mobileFromToken, // 🔥 from token only
    },
    landingData
  );

  // ✅ Now generate REAL auth tokens
  const { accessToken, refreshToken } = generateTokens(newUser);

  return { user: toSafeUser(newUser), accessToken, refreshToken };
};

export const updateProfile = async (
  userId,
  body
) => {

  const user =
    await UserRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const updated =
    await UserRepository.updateUser(
      userId,
      {
        firstName: body.firstName,
        lastName: body.lastName,
        username: body.username,
        email: body.email,

        country: body.country,
        state: body.state,
        city: body.city,
        district: body.district,

        gender: body.gender,
        address: body.address,

        dataOfBirth: body.dataOfBirth
          ? new Date(body.dataOfBirth)
          : undefined,

        image: body.image,
      }
    );

  return updated;
};

// change password logic 
export const changePassword = async (
  userId,
  body
) => {

  const {
    currentPassword,
    newPassword,
    confirmPassword,
  } = body;

  const user =
    await UserRepository.findByIdWithPassword(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // check current password

  const isMatch =
    await bcrypt.compare(
      currentPassword,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Current password is incorrect"
    );
  }

  // check confirm password

  if (newPassword !== confirmPassword) {
    throw new Error(
      "New password and confirm password do not match"
    );
  }

  // optional validation

  if (newPassword.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      12
    );

  await UserRepository.updatePassword(
    userId,
    hashedPassword
  );

  return {
    success: true,
    message:
      "Password changed successfully",
  };
};

// forgot password and reset password logic can be added here in future
export const forgotPassword = async (email) => {

  const user =
    await UserRepository.findByEmailWithPassword(email);

  if (!user) {
    throw new Error("User not found");
  }

  const token = jwt.sign(
    {
      id: user.id,
      ph: passwordFingerprint(user.password),
    },
    process.env.JWT_RESET_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const resetLink =
    `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: user.email,

    subject: "Reset Password",

    html: `
      <h3>Reset Password</h3>

      <p>Click below link:</p>

      <a href="${resetLink}">
        Reset Password
      </a>

      <p>Link valid for 15 minutes.</p>
    `,
  });

  return {
    success: true,
    message: "Reset link sent successfully",
  };
};

// reset password logic can be implemented in future as well
export const resetPassword = async (
  token,
  newPassword,
  confirmPassword
) => {

  if (!token || !newPassword) {
    throw new Error(
      "Token and new password are required"
    );
  }

  if (
    newPassword !==
    confirmPassword
  ) {
    throw new Error(
      "Passwords do not match"
    );
  }

  let decoded;
  try {
    decoded =
      jwt.verify(
        token,
        process.env.JWT_RESET_SECRET
      );
  } catch {
    throw new Error(
      "Reset link is invalid or has expired"
    );
  }

  const user =
    await UserRepository.findByIdWithPassword(
      Number(decoded.id)
    );

  // Single use: the token carries a fingerprint of the password hash it was issued for.
  // (Links issued before this change carry no fingerprint and simply expire after 15 minutes.)
  if (
    !user ||
    (decoded.ph !== undefined &&
      decoded.ph !== passwordFingerprint(user.password))
  ) {
    throw new Error(
      "Reset link is invalid or has already been used"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      12
    );

  await UserRepository.updatePassword(
    user.id,
    hashedPassword
  );

  return {
    success: true,
    message:
      "Password reset successful",
  };
};

export const getAllUsers = async () => {
  try {

    const users =
      await UserRepository.getAllUsers();

    return {
      success: true,
      data: users,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
  
};

// 🔥 ADMIN GET USER BY ID

export const getUserById = async (id) => {
  try {

    const user =
      await UserRepository.getUserById(
        Number(id)
      );

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      data: user,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 BAN USER

export const banUser = async (id) => {
  try {

    const user =
      await UserRepository.findById(
        Number(id)
      );

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const updated =
      await UserRepository.banUser(
        Number(id)
      );

    return {
      success: true,
      message:
        "User banned successfully",
      data: updated,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 UNBAN USER

export const unbanUser = async (id) => {
  try {

    const user =
      await UserRepository.findById(
        Number(id)
      );

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const updated =
      await UserRepository.unbanUser(
        Number(id)
      );

    return {
      success: true,
      message:
        "User activated successfully",
      data: updated,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 GET ALL BANNED USERS

export const getBannedUsers = async () => {
  try {

    const users =
      await UserRepository.getBannedUsers();

    return {
      success: true,
      data: users,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 GET USER TRANSACTIONS

export const getUserTransactions = async (userId) => {
  try {

    const transactions =
      await UserRepository.getUserTransactions(
        Number(userId)
      );

    return {
      success: true,
      data: transactions,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 GET LOGIN HISTORY

export const getLoginHistory = async (userId) => {
  try {

    const history =
      await UserRepository.getLoginHistory(
        Number(userId)
      );

    return {
      success: true,
      data: history,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};