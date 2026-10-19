import { Router } from "express";

import upload from "../../middlewares/upload.js";

import {
  protectAdminOrStaff,
} from "../../middlewares/protectAdminOrStaff.js";

import {
  uploadInstitutionExcelController,
} from "./institutionImport.controller.js";

const router = Router();

router.post(
  "/",
  protectAdminOrStaff,
  upload.single("file"),
  uploadInstitutionExcelController
);

export default router;