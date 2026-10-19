import { Router } from "express";

import {
  createStudyAbroadController,
  getStudyAbroadController,
  getStudyAbroadByIdController,
  updateStudyAbroadController,
  deleteStudyAbroadController,

  createStudyAbroadConsultController,
  getStudyAbroadConsultController,
  getStudyAbroadConsultByIdController,
  updateStudyAbroadConsultController,
  deleteStudyAbroadConsultController,

} from "./studyabroad.controller.js";

import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import { protectAuth } from "../../middlewares/protectAuth.js";

const router = Router();


// 🔥 STUDY ABROAD CRUD

router.post("/", protectAdminOrStaff, createStudyAbroadController);

router.get("/", getStudyAbroadController);

router.get("/:id", getStudyAbroadByIdController);

router.put("/:id", protectAdminOrStaff, updateStudyAbroadController);

router.delete("/:id", protectAdminOrStaff, deleteStudyAbroadController);


// ====================================================
// 🔥 CONSULT ROUTES
// ====================================================

// USER CREATE CONSULT
router.post(
  "/consult/create",
  protectAuth,
  createStudyAbroadConsultController
);

// ADMIN GET ALL CONSULTS
router.get(
  "/consult/all",
  protectAdminOrStaff,
  getStudyAbroadConsultController
);

// ADMIN GET SINGLE CONSULT
router.get(
  "/consult/:id",
  protectAdminOrStaff,
  getStudyAbroadConsultByIdController
);

// ADMIN UPDATE CONSULT
router.put(
  "/consult/:id",
  protectAdminOrStaff,
  updateStudyAbroadConsultController
);

// ADMIN DELETE CONSULT
router.delete(
  "/consult/:id",
  protectAdminOrStaff,
  deleteStudyAbroadConsultController
);

export default router;