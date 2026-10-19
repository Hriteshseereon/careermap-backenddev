import { Router }
from "express";

import {
  createStaffController,
  loginStaffController,
  getAllStaffController,
  getStaffByIdController,
  updateStaffController,
  deleteStaffController
}
from "./staff.controller.js";

import {
  protectAdmin
}
from "../../middlewares/protectAdmin.js";

const router = Router();

router.post(
  "/login",
  loginStaffController
);

router.post(
  "/",
  protectAdmin,
  createStaffController
);

router.get(
  "/",
  protectAdmin,
  getAllStaffController
);

router.get(
  "/:id",
  protectAdmin,
  getStaffByIdController
);

router.put(
  "/:id",
  protectAdmin,
  updateStaffController
);

router.patch(
  "/:id",
  protectAdmin,
  updateStaffController
);

router.delete(
  "/:id",
  protectAdmin,
  deleteStaffController
);

export default router;