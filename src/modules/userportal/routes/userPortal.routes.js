import { Router } from "express";
import { getDashboardController } from "../controller/userPortal.controller.js";
import {
  getUserSubscriptionsController,
  getCurrentSubscriptionController,
} from "../../mentorBooking/mentorBooking.controller.js";
import { protectAuth } from "../../../middlewares/protectAuth.js";

const router = Router();

router.get("/dashboard", protectAuth, getDashboardController);
router.get("/my-subscriptions", protectAuth, getUserSubscriptionsController);
router.get("/current-subscription", protectAuth, getCurrentSubscriptionController);

export default router;