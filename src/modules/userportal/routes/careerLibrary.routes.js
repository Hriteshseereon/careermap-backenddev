import { Router } from "express";
import { optionalAuth } from "../../../middlewares/optionalAuth.js";
import {
  getCategoriesController,
  getSecondCategoriesController,
  getSubCategoriesController,
  getDetailsController,
  getNextLevelController,
} from "../controller/careerLibrary.controller.js";
import { getPaginatedInstitutionsController } from "../../institution/institution.controller.js";

const router = Router();

router.use(optionalAuth);

router.get("/categories", getCategoriesController);

router.get(
  "/categories/:categoryId/second",
  getSecondCategoriesController
);

router.get(
  "/second/:secondcategoryId/sub",
  getSubCategoriesController
);

router.get(
  "/subcategory/:subcategoryId/details",
  getDetailsController
);

router.get("/next/:type/:id", getNextLevelController);

// 🏛️ Dynamic Paginated Institutions for Career Archive / Career Library
// Query params supported: streamId, categoryId, secondcategoryId, subcategoryId, search, state, city, type, page, limit
router.get("/institutions", getPaginatedInstitutionsController);

export default router;
