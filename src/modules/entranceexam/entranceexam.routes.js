import { Router } from "express";
import * as ctrl from "./entranceexam.controller.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
const router = Router();

router.post("/", protectAdminOrStaff, ctrl.create);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.put("/:id", protectAdminOrStaff, ctrl.update);
router.delete("/:id", protectAdminOrStaff, ctrl.remove);

export default router;