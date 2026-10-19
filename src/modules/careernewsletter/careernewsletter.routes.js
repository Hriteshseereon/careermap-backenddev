import express from "express";
import upload from "../../middlewares/upload.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import {
  createCareerNewsletterController,
  getCareerNewslettersController,
  getCareerNewsletterByIdController,
  updateCareerNewsletterController,
  deleteCareerNewsletterController,
} from "./careernewsletter.controller.js";


const router = express.Router();

router.post(
  "/",
  protectAdminOrStaff,
  upload.single("image"),
  createCareerNewsletterController
);

router.get("/", getCareerNewslettersController);

router.get("/:id", getCareerNewsletterByIdController);

router.put(
  "/:id",
  protectAdminOrStaff,
  upload.single("image"),
  updateCareerNewsletterController
);

router.delete("/:id", protectAdminOrStaff, deleteCareerNewsletterController);

export default router;