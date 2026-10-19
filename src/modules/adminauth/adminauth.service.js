import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AdminAuthRepository } from "./adminauth.repository.js";
import { generateAdminTokens } from "../../utils/helpers.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail.js";
import { escapeHtml } from "../../utils/escapeHtml.js";
// Never send credential material to a client.
const toSafeAdmin = (admin) => {
  if (!admin || typeof admin !== "object") return admin;
  const { password, resetToken, resetTokenExpiry, ...safe } = admin;
  return safe;
};


// 🔹 Signup (protected: an admin token, or the one-time bootstrap — see adminauth.routes.js)
export const adminSignup = async (body) => {
  try {
    const { email, password, firstName, lastName, username } = body || {};

    if (!email || !password) {
      return { success: false, message: "Email and password are required" };
    }

    const existing = await AdminAuthRepository.findByEmail(email);

    if (existing) {
      return { success: false, message: "Admin already exists" };
    }

    const hashedPassword = await bcrypt.hash(String(password), 12);

    // Whitelisted fields only: role, lock and reset fields can never be set from the request.
    const admin = await AdminAuthRepository.createAdmin({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      username,
    });

    return {
      success: true,
      message: "Admin created successfully",
      admin: toSafeAdmin(admin),
    };

  } catch (error) {
    console.error("❌ Service Error (adminSignup):", error.message);
    return { success: false, message: error.message };
  }
};
// 🔹 Login
export const adminLogin = async (
  email,
  password
) => {

  const admin =
    await AdminAuthRepository.findByEmailWithPassword(
      email
    );

  if (!admin) {
    return {
      success: false,
      message: "Admin not found",
    };
  }

  // Account locked check
  if (
    admin.lockedUntil &&
    admin.lockedUntil > new Date()
  ) {

    const remainingMinutes =
      Math.ceil(
        (admin.lockedUntil - new Date()) /
        60000
      );

    return {
      success: false,
      message:
        `Account locked. Try again after ${remainingMinutes} minutes.`,
    };
  }

  const isMatch =
    await bcrypt.compare(
      password,
      admin.password
    );

  if (!isMatch) {

    const updated =
      await AdminAuthRepository.incrementLoginAttempts(
        admin.id
      );

    if (
      updated.loginAttempts >= 5
    ) {

      await AdminAuthRepository.lockAccount(
        admin.id
      );

      return {
        success: false,
        message:
          "Too many failed attempts. Account locked for 60 minutes.",
      };
    }

    return {
      success: false,
      message:
        `Invalid credentials. Remaining attempts: ${
          5 -
          updated.loginAttempts
        }`,
    };
  }

  // Success Login
  await AdminAuthRepository.resetLoginAttempts(
    admin.id
  );

   // CHECK MAX 3 DEVICES
  const activeSessions =
    await AdminAuthRepository.getActiveSessions(
      admin.id
    );

  if (activeSessions >= 50) {
    return {
      success: false,
      message:
        "Maximum 15 devices already logged in. Please logout from another device first.",
    };
  }

  const tokens =
    generateAdminTokens(admin);

  // SAVE SESSION
  await AdminAuthRepository.createSession({
    adminId: admin.id,
    refreshToken: tokens.refreshToken,
    isActive: true,
  });


  return {
    success: true,
    admin: toSafeAdmin(admin),
    ...tokens,
  };
};
export const refreshAdminToken = async (
  refreshToken
) => {
  try {

    const decoded = jwt.verify(
      refreshToken,
      process.env.ADMIN_JWT_REFRESH_SECRET
    );

    if (decoded.type !== "admin") {
      return {
        success: false,
        message: "Invalid token"
      };
    }

    // The refresh token must belong to a session that has not been logged out.
    const session =
      await AdminAuthRepository.findSession(
        refreshToken
      );

    if (!session || !session.isActive) {
      return {
        success: false,
        message: "Session expired. Please log in again."
      };
    }

    const admin =
      await AdminAuthRepository.findById(
        decoded.adminId
      );

    if (!admin) {
      return {
        success: false,
        message: "Admin not found"
      };
    }

    const accessToken = jwt.sign(
      {
        adminId: admin.id,
        role: admin.role,
        type: "admin"
      },
      process.env.ADMIN_JWT_ACCESS_SECRET,
      {
        expiresIn: "15m"
      }
    );

    return {
      success: true,
      accessToken
    };

  } catch (error) {

    console.log(error);

    return {
      success: false,
      message: error.message
    };
  }
};
export const changePassword = async (
  adminId,
  oldPassword,
  newPassword
) => {
  const admin =
    await AdminAuthRepository.findByIdWithPassword(
      adminId
    );

  if (!admin) {
    return {
      success: false,
      message: "Admin not found",
    };
  }

  const isMatch =
    await bcrypt.compare(
      oldPassword,
      admin.password
    );

  if (!isMatch) {
    return {
      success: false,
      message:
        "Old password is incorrect",
    };
  }

  if (oldPassword === newPassword) {
    return {
      success: false,
      message:
        "New password must be different from old password",
    };
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      12
    );

  await AdminAuthRepository.updatePassword(
    admin.id,
    hashedPassword
  );

  return {
    success: true,
    message:
      "Password changed successfully",
  };
};
export const logoutAdmin = async (
  refreshToken
) => {

  await AdminAuthRepository.deactivateSession(
    refreshToken
  );

  return {
    success: true,
    message: "Admin logged out successfully",
  };
};

export const forgotPassword = async (email) => {
  const admin = await AdminAuthRepository.findByEmail(email);

  if (!admin) {
    return {
      success: false,
      message: "Admin not found",
    };
  }

  // Generate Token
  const token = crypto.randomBytes(32).toString("hex");

  // Expiry 15 Minutes
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  // Save Token
  await AdminAuthRepository.saveResetToken(
    admin.id,
    token,
    expiry
  );

  // Reset Link
  const resetLink =
    `${process.env.FRONTEND_URL}/admin/reset-password?token=${token}`;

  // Send Email
  await sendEmail(
    admin.email,
    "Reset Your Password",
    `
      <h2>Password Reset</h2>

      <p>Hello ${escapeHtml(admin.firstName || "Admin")},</p>

      <p>Click the link below to reset your password.</p>

      <a href="${resetLink}">
        Reset Password
      </a>

      <p>This link will expire in 15 minutes.</p>
    `
  );

  return {
    success: true,
    message: "Password reset link sent successfully.",
  };
};

export const resetPassword = async (
  token,
  password
) => {

  const admin =
    await AdminAuthRepository.findByResetToken(
      token
    );

  if (!admin) {
    return {
      success: false,
      message:
        "Invalid or expired reset link.",
    };
  }

  const hashedPassword =
    await bcrypt.hash(password, 12);

  await AdminAuthRepository.updatePassword(
    admin.id,
    hashedPassword
  );

  return {
    success: true,
    message:
      "Password reset successfully.",
    };
};