import express from "express";
import {
  createCounselingController,
  getCounselingsController,
  getMyCounselingReportsController,
  getCounselingsByCounselorController,
  getCounselingByIdController,
  updateCounselingController,
  deleteCounselingController,
  downloadCounselingReportController,
} from "./counseling.controller.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";

const router = express.Router();

// 🔹 Specific sub-routes (must come BEFORE parameterized /:id route)
router.get("/my-reports", protectAdminOrStaff, getMyCounselingReportsController);
router.get("/counselor/:counselorName", protectAdminOrStaff, getCounselingsByCounselorController);

// 🔹 Main CRUD routes
router.post("/", protectAdminOrStaff, createCounselingController);
router.get("/", protectAdminOrStaff, getCounselingsController);
router.get("/:id", protectAdminOrStaff, getCounselingByIdController);
router.put("/:id", protectAdminOrStaff, updateCounselingController);
router.delete("/:id", protectAdminOrStaff, deleteCounselingController);

// 🔹 PDF Report download
router.get(
  "/:id/report",
  protectAdminOrStaff,
  downloadCounselingReportController
);

export default router;