import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import {
  createSecondCategoryController,
  getSecondCategoriesController,
  getSecondCategoryByIdController,
  updateSecondCategoryController,
  deleteSecondCategoryController,
    getSecondByCategoryController,
} from "./secondcategory.controller.js";

const router = Router();

router.post(
  "/",
  protectAdminOrStaff,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createSecondCategoryController
);

router.get("/", getSecondCategoriesController);
router.get("/:id", getSecondCategoryByIdController);

router.put(
  "/:id",
  protectAdminOrStaff,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateSecondCategoryController
);

router.delete("/:id", protectAdminOrStaff, deleteSecondCategoryController);
router.get(
  "/category/:categoryId",
  getSecondByCategoryController
);
export default router;