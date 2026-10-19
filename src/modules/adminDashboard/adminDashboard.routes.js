import { Router } from "express";

import {
  getDashboardController,
  getAllTransactionsController,
  getAllMentorBookingsController,
} from "./adminDashboard.controller.js";

import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
const router = Router();

router.get(
  "/dashboard",
  protectAdminOrStaff,
  getDashboardController
);

router.get(
  "/transactions",
  protectAdminOrStaff,
  getAllTransactionsController
);

router.get(
  "/mentor-bookings",
  protectAdminOrStaff,
  getAllMentorBookingsController
);

export default router;