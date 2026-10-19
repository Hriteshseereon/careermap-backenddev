import { Router } from "express";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "./careerpath.controller.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";

const router = Router();

// 🔹 CREATE
router.post("/", protectAdminOrStaff, create);

// 🔹 GET ALL
router.get("/", getAll);

// 🔹 GET BY ID (safe route)
router.get("/id/:id", getById);

// 🔹 UPDATE
router.put("/:id", protectAdminOrStaff, update);

// 🔹 DELETE
router.delete("/:id", protectAdminOrStaff, remove);

export default router;