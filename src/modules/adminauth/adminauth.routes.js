import { Router } from "express";
import { signupAdmin, loginAdmin,refreshTokenAdmin,adminLogout,changePasswordAdmin,forgotPasswordAdmin,
  resetPasswordAdmin,
} from "./adminauth.controller.js";

import crypto from "crypto";
import { protectAdmin } from "../../middlewares/protectAdmin.js";
import { AdminAuthRepository } from "./adminauth.repository.js";
const router = Router();

// Creating an admin requires a logged-in admin. The only exception is the one-time
// bootstrap of the very first admin: AdminUsers table empty AND the
// "x-admin-bootstrap-secret" header equals the ADMIN_BOOTSTRAP_SECRET env var.
const requireAdminOrBootstrap = async (req, res, next) => {
  if (req.headers.authorization) {
    return protectAdmin(req, res, next);
  }

  try {
    const secret = Buffer.from(String(process.env.ADMIN_BOOTSTRAP_SECRET || ""));
    const provided = Buffer.from(String(req.headers["x-admin-bootstrap-secret"] || ""));
    const matches =
      secret.length > 0 &&
      provided.length === secret.length &&
      crypto.timingSafeEqual(provided, secret);

    if (matches && (await AdminAuthRepository.countAdmins()) === 0) {
      return next();
    }
  } catch (error) {
    return next(error);
  }

  return res.status(401).json({
    success: false,
    message: "Admin authentication required",
  });
};

// 🔹 Admin Auth Routes
router.post("/signup", requireAdminOrBootstrap, signupAdmin);
router.post("/login", loginAdmin);
router.post("/refresh-token", refreshTokenAdmin);
router.post("/logout", adminLogout);
router.post(
  "/change-password",
  protectAdmin, 
  changePasswordAdmin
);

router.post(
  "/forgot-password",
  forgotPasswordAdmin
);

router.post(
  "/reset-password",
  resetPasswordAdmin
);
export default router;