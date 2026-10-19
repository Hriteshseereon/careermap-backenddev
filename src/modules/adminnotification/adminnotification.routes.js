import { Router } from "express";

import {
  getAdminNotificationsController,
} from "./adminnotification.controller.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";

const router = Router();

router.get(
  "/",
  protectAdminOrStaff,
  getAdminNotificationsController
);

export default router;