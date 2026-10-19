import upload from "../../middlewares/upload.js";
import { createmodulecontroller,getModuleController,getModuleByIdController,updateModuleController,deleteModuleController } from "./module.controller.js";
import {Router} from "express";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";

const router = Router();
router.post("/",protectAdminOrStaff,upload.single("image"),createmodulecontroller);
router.get("/",getModuleController)
router.get("/:id",getModuleByIdController);
router.put("/:id",protectAdminOrStaff,upload.single("image"),updateModuleController);
router.delete("/:id",protectAdminOrStaff,deleteModuleController);

export default router;