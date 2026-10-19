import { createInstitutionController,getInstitutionsController,updateInstitutionController,deleteInstitutionController,getInstitutionByIdController, getPaginatedInstitutionsController, } from "./institution.controller.js";
import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";

const router = Router();
router.post("/", protectAdminOrStaff, upload.single("image"), createInstitutionController);
router.get("/", getInstitutionsController);
router.get(
  "/paginated",
  getPaginatedInstitutionsController
);
router.get("/:id", getInstitutionByIdController);

router.put("/:id", protectAdminOrStaff, upload.single("image"), updateInstitutionController);
router.delete("/:id", protectAdminOrStaff, deleteInstitutionController);

export default router;