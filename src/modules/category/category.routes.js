import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import { protectAuth } from "../../middlewares/protectAuth.js";
import { optionalAuth } from "../../middlewares/optionalAuth.js";
import {
  createCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
  getCategoriesByStreamIdController,
  updateCategoryPreviewAccessController,
} from "./category.controller.js";

const router = Router();

// 🔹 Routes
router.post("/", protectAdminOrStaff, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 }
]), createCategoryController);

router.get(
  "/stream/:streamId", optionalAuth,getCategoriesByStreamIdController);
router.get("/", getCategoriesController);
router.get("/:id", getCategoryByIdController);
router.put("/:id", protectAdminOrStaff, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 }
]), updateCategoryController);
router.delete("/:id", protectAdminOrStaff, deleteCategoryController);
router.patch(
  "/:id/preview-access",
  protectAdminOrStaff,
  updateCategoryPreviewAccessController
);
export default router;