import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import { optionalAuth } from "../../middlewares/optionalAuth.js";

import {
  createScholarshipController,
  getScholarshipsController,
  getScholarshipByIdController,
  updateScholarshipController,
  deleteScholarshipController,
  updateScholarshipFreeStatusController,
} from "./scholarship.controller.js";

const router = Router();

router.post(
  "/",
  protectAdminOrStaff,
  upload.single("image"),
  createScholarshipController
);

router.get("/", getScholarshipsController);
router.get("/:id", optionalAuth, getScholarshipByIdController);

router.put(
  "/:id",
  protectAdminOrStaff,
  upload.single("image"),
  updateScholarshipController
);

router.delete("/:id", protectAdminOrStaff, deleteScholarshipController);
router.patch(
  "/:id/free-status",
  protectAdminOrStaff,
  updateScholarshipFreeStatusController
);
export default router;