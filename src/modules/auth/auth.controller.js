import { otpService, verifyOTPService,loginWithEmailPassword} from "./auth.service.js";
import jwt from "jsonwebtoken";
import { UserRepository } from "../user/user.repository.js";
export const sendOTP = async (req, res) => {
    const { mobile,type } = req.body;
    const result = await otpService(mobile,type);
    if (result.success) {
        return res.status(200).json(result);
    } else {
        return res.status(500).json(result);
    }
};

export const verifyOTP = async (req, res) => {
  try {
    const { mobile, code, type } = req.body; // ✅ add type

    if (!mobile || !code || !type) {
      return res.status(400).json({ message: "Mobile, code and type required" });
    }

    const result = await verifyOTPService(mobile, code, type);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// login with email and password
export const loginWithPassword = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Body missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await loginWithEmailPassword(email, password);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {

    const token =
      req.body?.refreshToken ||
      req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const user =
      await UserRepository.findById(
        Number(decoded.id)
      );

    // Deleted or banned accounts must not get new access tokens.
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    if (user.status === "banned") {
      return res.status(403).json({
        message: "Your account has been banned. Contact support.",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    return res.json({
      success: true,
      accessToken,
    });

  } catch (error) {

    return res.status(401).json({
      message: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    // 🔥 clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};