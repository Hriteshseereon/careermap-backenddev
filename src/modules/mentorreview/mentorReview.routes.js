import { Router } from "express";

import {
  createReviewController,
  getMentorReviewsController,
} from "./mentorReview.controller.js";

import {
  protectAuth,
} from "../../middlewares/protectAuth.js";

const router = Router();

router.post(
  "/",
  protectAuth,
  createReviewController
);

router.get(
  "/mentor/:mentorId",
  getMentorReviewsController
);

export default router;