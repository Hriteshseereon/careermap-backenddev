import { Router } from "express";

import {

  createHelpRequestController,
  getHelpRequestsController,
  getHelpRequestByIdController,
  updateHelpStatusController,

} from "./helpandsupport.controller.js";

import { protectAuth } from "../../middlewares/protectAuth.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";

const router = Router();

// USER
router.post(
  "/",
  protectAuth,
  createHelpRequestController
);

// ADMIN / STAFF
router.get(
  "/",
  protectAdminOrStaff,
  getHelpRequestsController
);

router.get(
  "/:id",
  protectAdminOrStaff,
  getHelpRequestByIdController
);

router.put(
  "/:id/status",
  protectAdminOrStaff,
  updateHelpStatusController
);

export default router;