import express from "express";

import {
  submitAssessmentController,
  getMyAssessmentController,
  getAssessmentByIdController,
  deleteAssessmentController,
} from "./assessment.controller.js";

import { protectAuth } from "../../middlewares/protectAuth.js";

const router = express.Router();

// Submit Assessment
router.post(
  "/submit",
 protectAuth,
  submitAssessmentController
);

// Get Logged In User Latest Assessment
router.get(
  "/my-result",
  protectAuth,
  getMyAssessmentController
);

// Get Assessment By Id
router.get(
  "/:id",
  protectAuth,
  getAssessmentByIdController
);

// Delete Assessment
router.delete(
  "/:id",
  protectAuth,
  deleteAssessmentController
);

export default router;