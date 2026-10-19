import { getMentorAvailabilityController } from "../controller/mentorAvailability.controller.js";
import { Router } from "express";
const router = Router();
// 🔥 availability route
router.get("/:id/availability", getMentorAvailabilityController);

export default router;