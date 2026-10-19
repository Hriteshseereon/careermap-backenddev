import { Router } from "express";

import {
  createLoginHistoryController,
  getLoginHistoryController,
  getLoginHistoryByIdController,
} from "./userLoginHistory.controller.js";

import { protectAuth } from "../../middlewares/protectAuth.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";

const router = Router();

// USER SAVE LOGIN INFO

router.post(
  "/",
  protectAuth,
  createLoginHistoryController
);

// ADMIN VIEW ALL

router.get(
  "/",
  protectAdminOrStaff,
  getLoginHistoryController
);

// ADMIN VIEW SINGLE

router.get(
  "/:id",
  protectAdminOrStaff,
  getLoginHistoryByIdController
);

export default router;