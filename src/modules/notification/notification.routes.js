import { Router } from "express";

import {

  createNotificationController,
  getNotificationsController,
  getNotificationByIdController,
  updateNotificationController,
  getUserNotificationsController,

} from "./notification.controller.js";

import { protectAdminOrStaff }
from "../../middlewares/protectAdminOrStaff.js";

const router = Router();

// 🔥 ADMIN CRUD

router.post(
  "/",
  protectAdminOrStaff,
  createNotificationController
);

router.get(
  "/",
  protectAdminOrStaff,
  getNotificationsController
);

router.get(
  "/:id",
  protectAdminOrStaff,
  getNotificationByIdController
);

router.put(
  "/:id",
  protectAdminOrStaff,
  updateNotificationController
);

// 🔥 USER NOTIFICATION API
router.get(
  "/user/all",
  getUserNotificationsController
);

export default router;