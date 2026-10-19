import { Router } from "express";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";

import {
  createPlanController,
  getPlansController,
  getPlanByIdController,
  updatePlanController,
  deletePlanController,
} from "./plans.controller.js";

const router = Router();

router.post("/", protectAdminOrStaff, createPlanController);
router.get("/", getPlansController);
router.get("/:id", getPlanByIdController);
router.put("/:id", protectAdminOrStaff, updatePlanController);
router.delete("/:id", protectAdminOrStaff, deletePlanController);

export default router;