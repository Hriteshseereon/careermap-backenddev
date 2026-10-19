import { Router } from "express";

import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import {

  createStudentController,
  getStudentsController,
  getStudentsByInstituteController,
  getStudentByIdController,
  updateStudentController,
  deleteStudentController,
    bulkCreateStudentsController

} from "./instituteStudent.controller.js";
import upload from "../../middlewares/upload.js";
const router = Router();


// CREATE
router.post(
  "/",
  protectAdminOrStaff,
  createStudentController
);


// GET ALL
router.get(
  "/",
 protectAdminOrStaff,
  getStudentsController
);


// GET BY INSTITUTE
router.get(
  "/institute/:instituteId",
  protectAdminOrStaff,
  getStudentsByInstituteController
);


// GET BY ID
router.get(
  "/:id",
 protectAdminOrStaff,
  getStudentByIdController
);


// UPDATE
router.put(
  "/:id",
  protectAdminOrStaff,
  updateStudentController
);


// DELETE
router.delete(
  "/:id",
  protectAdminOrStaff,
  deleteStudentController
);

router.post(
  "/bulk-upload",
  protectAdminOrStaff,
  upload.single("file"),
  bulkCreateStudentsController
);
export default router;