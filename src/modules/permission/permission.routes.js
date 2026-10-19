import { Router } from "express";

import {
  createPermissionController,
  getPermissionsController,
  getPermissionByIdController,
  updatePermissionController,
  deletePermissionController,
} from "./permission.controller.js";

import {
  protectAdmin,
} from "../../middlewares/protectAdmin.js";

const router = Router();

router.post(
  "/",
  protectAdmin,
  createPermissionController
);

router.get(
  "/",
  protectAdmin,
  getPermissionsController
);

router.get(
  "/:id",
  protectAdmin,
  getPermissionByIdController
);

router.put(
  "/:id",
  protectAdmin,
  updatePermissionController
);

router.delete(
  "/:id",
  protectAdmin,
  deletePermissionController
);

export default router;