import { Router } from "express";
import {signup, updateProfileController,changePasswordController,forgotPasswordController,resetPasswordController, getAllUsersController,getUserByIdController, banUserController,
  unbanUserController,getBannedUsersController,getUserTransactionsController, getLoginHistoryController} from "./user.controller.js";
import { protectAuth } from "../../middlewares/protectAuth.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import { protectTemp } from "../../middlewares/protectTemp.js";
const router = Router();

router.post('/signup', protectTemp, signup);
router.put(
  "/profile",
  protectAuth,
  updateProfileController
);
router.put(
  "/change-password",
  protectAuth,
  changePasswordController
);

router.post(
  "/forgot-password",
  forgotPasswordController
);

router.post(
  "/reset-password",
  resetPasswordController
);
router.get(
  "/admin/users",
  protectAdminOrStaff,
  getAllUsersController
);
router.get(
  "/admin/users/:id",
  protectAdminOrStaff,
  getUserByIdController
);

router.put(
  "/admin/users/:id/ban",
  protectAdminOrStaff,
  banUserController
);

router.put(
  "/admin/users/:id/unban",
  protectAdminOrStaff,
  unbanUserController
);
router.get(
  "/admin/banned-users",
  protectAdminOrStaff,
  getBannedUsersController
);
router.get(
  "/admin/users/:id/transactions",
  protectAdminOrStaff,
  getUserTransactionsController
);
router.get(
  "/admin/users/:id/login-history",
  protectAdminOrStaff,
  getLoginHistoryController
);
export default router;