import express from "express";
import {
  createCounselingController,
  getCounselingsController,
  getMyCounselingReportsController,
  getCounselingsByCounselorController,
  getInstituteCounselingReportsController,
  getCounselingByIdController,
  updateCounselingController,
  deleteCounselingController,
  downloadCounselingReportController,
} from "./counseling.controller.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import { protectInstitute } from "../../middlewares/protectInstitute.js";
import { protectAdminOrStaffOrInstitute } from "../../middlewares/protectAdminOrStaffOrInstitute.js";

const router = express.Router();

// 🔹 Specific sub-routes (must come BEFORE parameterized /:id route)
router.get("/my-reports", protectAdminOrStaff, getMyCounselingReportsController);
router.get("/institute-reports", protectInstitute, getInstituteCounselingReportsController);
router.get("/counselor/:counselorName", protectAdminOrStaff, getCounselingsByCounselorController);

// 🔹 Main CRUD routes
router.post("/", protectAdminOrStaff, createCounselingController);
router.get("/", protectAdminOrStaffOrInstitute, getCounselingsController);
router.get("/:id", protectAdminOrStaffOrInstitute, getCounselingByIdController);
router.put("/:id", protectAdminOrStaff, updateCounselingController);
router.delete("/:id", protectAdminOrStaff, deleteCounselingController);

// 🔹 PDF Report download
router.get(
  "/:id/report",
  protectAdminOrStaffOrInstitute,
  downloadCounselingReportController
);

export default router;
