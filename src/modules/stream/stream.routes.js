import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import {
  createStreamController,
  getStreamsController,
  updateStreamController,
  deleteStreamController,
} from "./stream.controller.js";

const router = Router();

router.post("/", protectAdminOrStaff, upload.single("image"), createStreamController);
router.get("/", getStreamsController);
router.put("/:id", protectAdminOrStaff, upload.single("image"), updateStreamController);
router.delete("/:id", protectAdminOrStaff, deleteStreamController);

export default router;