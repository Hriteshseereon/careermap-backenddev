import { Router } from "express";

import {
  createOrderController,
  verifyPaymentController,
  myBookingsController,
  allBookingsController,
   getBookedSlotsController,
    userMentorBookingsController,
     getUserSubscriptionsController
} from "./mentorBooking.controller.js";

import { protectAuth } from "../../middlewares/protectAuth.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";

const router = Router();

router.post(
  "/create-order",
  protectAuth,
  createOrderController
);

router.post(
  "/verify-payment",
  protectAuth,
  verifyPaymentController
);

router.get(
  "/my-bookings",
  protectAuth,
  myBookingsController
);

router.get(
  "/all-bookings",
  protectAdminOrStaff,
  allBookingsController
);
router.get(
  "/booked-slots",
  getBookedSlotsController
);
router.get(
  "/my-mentor-bookings",
  protectAuth,
  userMentorBookingsController
);
router.get(
  "/my-subscriptions",
  protectAuth,
  getUserSubscriptionsController
);
export default router;