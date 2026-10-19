import { Router } from "express";
import { optionalAuth } from "../../middlewares/optionalAuth.js";
import {
  globalSearchController,
  getSearchSuggestionsController,
} from "./search.controller.js";

const router = Router();

// Apply optional authentication (works for both public visitors and logged-in users)
router.use(optionalAuth);

/**
 * @route   GET /api/search
 * @desc    Global search across all database models
 * @query   q, type, limit
 */
router.get("/", globalSearchController);

/**
 * @route   GET /api/search/suggestions
 * @desc    Quick auto-complete suggestions for navbar dropdown
 * @query   q, limit
 */
router.get("/suggestions", getSearchSuggestionsController);

export default router;
