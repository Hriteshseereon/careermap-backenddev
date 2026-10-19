import { SearchService } from "./search.service.js";

/**
 * Controller for Global Search
 * GET /api/search?q=query&type=all&limit=10
 */
export const globalSearchController = async (req, res) => {
  try {
    const query = req.query.q || req.query.query || "";
    const type = req.query.type || "all";
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await SearchService.globalSearch({
      query,
      type,
      limit,
    });

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error during search",
    });
  }
};

/**
 * Controller for Search Suggestions / Autocomplete
 * GET /api/search/suggestions?q=query&limit=8
 */
export const getSearchSuggestionsController = async (req, res) => {
  try {
    const query = req.query.q || req.query.query || "";
    const limit = parseInt(req.query.limit, 10) || 8;

    const result = await SearchService.getSuggestions({
      query,
      limit,
    });

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error during suggestions",
    });
  }
};
