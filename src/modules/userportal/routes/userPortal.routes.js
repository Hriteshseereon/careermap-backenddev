import { Router } from "express";
import { getDashboardController } from "../controller/userPortal.controller.js";
import { protectAuth } from "../../../middlewares/protectAuth.js";

const router = Router();

router.get("/dashboard",protectAuth,getDashboardController);

export default router;