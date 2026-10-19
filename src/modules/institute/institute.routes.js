import { Router } from "express";

import {
  createInstituteController,
  loginInstituteController,
  getInstitutesController,
  getInstituteByIdController,
  updateInstituteController,
  deleteInstituteController,
  getInstituteDashboardController,
  getInstituteStudentsController,
  getInstitutePsychometricAssessmentsController,
} from "./institute.controller.js";

import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import { protectInstitute } from "../../middlewares/protectInstitute.js";

const router = Router();

// LOGIN
router.post(
  "/login",
  loginInstituteController
);

// INSTITUTE PORTAL (Institute Logged In)
router.get(
  "/dashboard",
  protectInstitute,
  getInstituteDashboardController
);

router.get(
  "/students",
  protectInstitute,
  getInstituteStudentsController
);

router.get(
  "/psychometric-assessments",
  protectInstitute,
  getInstitutePsychometricAssessmentsController
);

// ADMIN / STAFF CRUD ROUTES
router.post(
  "/",
  protectAdminOrStaff,
  createInstituteController
);

router.get(
  "/",
  protectAdminOrStaff,
  getInstitutesController
);

router.get(
  "/:id",
  protectAdminOrStaff,
  getInstituteByIdController
);

router.get(
  "/:id/students",
  protectAdminOrStaff,
  getInstituteStudentsController
);

router.get(
  "/:id/psychometric-assessments",
  protectAdminOrStaff,
  getInstitutePsychometricAssessmentsController
);

router.put(
  "/:id",
  protectAdminOrStaff,
  updateInstituteController
);

router.delete(
  "/:id",
  protectAdminOrStaff,
  deleteInstituteController
);

export default router;