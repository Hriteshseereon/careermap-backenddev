import { Router } from "express";

import {
  getDashboardController,
  getAllTransactionsController,
  getAllMentorBookingsController,
  getAllSubscribersController,
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

router.get(
  "/subscribers",
  protectAdminOrStaff,
  getAllSubscribersController
);

router.get(
  "/subscriptions",
  protectAdminOrStaff,
  getAllSubscribersController
);

export default router;