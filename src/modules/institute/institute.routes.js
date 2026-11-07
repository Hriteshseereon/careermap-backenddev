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
  getInstituteCounselingReportsController,
} from "./institute.controller.js";

import {
  instituteCreateStudentController,
  instituteBulkCreateStudentsController,
  instituteUpdateStudentController,
  instituteDeleteStudentController,
} from "../instituteStudent/instituteStudent.controller.js";
import upload from "../../middlewares/upload.js";
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

// Institute adds / manages its own students (seat limit is set by admin)
router.post(
  "/students",
  protectInstitute,
  instituteCreateStudentController
);

router.post(
  "/students/bulk-upload",
  protectInstitute,
  upload.single("file"),
  instituteBulkCreateStudentsController
);

router.put(
  "/students/:id",
  protectInstitute,
  instituteUpdateStudentController
);

router.delete(
  "/students/:id",
  protectInstitute,
  instituteDeleteStudentController
);

router.get(
  "/psychometric-assessments",
  protectInstitute,
  getInstitutePsychometricAssessmentsController
);

router.get(
  "/counseling-reports",
  protectInstitute,
  getInstituteCounselingReportsController
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

router.get(
  "/:id/counseling-reports",
  protectAdminOrStaff,
  getInstituteCounselingReportsController
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
