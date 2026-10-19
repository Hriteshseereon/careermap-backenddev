import { Router } from "express";
import { protectAuth } from "../../middlewares/protectAuth.js";
import {
  checkModuleAccessController,
  startPagePreviewController,
  verifyPreviewSessionController,
} from "./moduleAccess.controller.js";

const router = Router();

router.post("/check", protectAuth, checkModuleAccessController);
router.post("/preview/start", protectAuth, startPagePreviewController);
router.post("/preview/verify", protectAuth, verifyPreviewSessionController);
router.get(
  "/preview/verify/:previewSessionId",
  protectAuth,
  verifyPreviewSessionController
);

export default router;
