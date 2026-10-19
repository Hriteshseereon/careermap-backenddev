import { Router } from "express";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import upload from "../../middlewares/upload.js"
import {
  createDetailsController,
  getAllDetailsController,
  getDetailsByIdController,
  updateDetailsController,
  deleteDetailsController
} from "./details.controller.js";

const router = Router();

router.post("/",protectAdminOrStaff,upload.single("media"), createDetailsController);
router.get("/", getAllDetailsController);
router.get("/:id", getDetailsByIdController);
router.put("/:id",protectAdminOrStaff,upload.single("media"), updateDetailsController);
router.delete("/:id",protectAdminOrStaff, deleteDetailsController);

export default router;