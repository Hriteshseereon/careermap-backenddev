import { Router } from "express";

import {
  createRoleController,
  getRolesController,
  getRoleByIdController,
  updateRoleController,
  deleteRoleController,
} from "./role.controller.js";

import {
  protectAdmin,
} from "../../middlewares/protectAdmin.js";

const router = Router();

router.post(
  "/",
  protectAdmin,
  createRoleController
);

router.get(
  "/",
  protectAdmin,
  getRolesController
);

router.get(
  "/:id",
  protectAdmin,
  getRoleByIdController
);

router.put(
  "/:id",
  protectAdmin,
  updateRoleController
);

router.delete(
  "/:id",
  protectAdmin,
  deleteRoleController
);

export default router;