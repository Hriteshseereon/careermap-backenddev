import {
  createInstitution,
  updateInstitution,
  getInstitutions,
  deleteInstitution,
  getInstitutionById,
  getPaginatedInstitutions,
  getInstitutionStates,
} from "./institution.service.js";

export const createInstitutionController = async (req, res) => {
  const result = await createInstitution(req.body, req.file);
  res.status(result.success ? 201 : 400).json(result);
};

export const getInstitutionsController = async (req, res) => {
  // If explicitly requested all without pagination:
  if (req.query.all === "true") {
    const result = await getInstitutions();
    return res.status(200).json(result);
  }
  // Otherwise default to paginated response supporting all query filters
  return getPaginatedInstitutionsController(req, res);
};

export const getInstitutionByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📥 Fetching institution ID:", id);

    const result = await getInstitutionById(id);

    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error("❌ Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateInstitutionController = async (req, res) => {
  const result = await updateInstitution(req.params.id, req.body, req.file);
  res.status(result.success ? 200 : 400).json(result);
};

export const deleteInstitutionController = async (req, res) => {
  const result = await deleteInstitution(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};

export const getPaginatedInstitutionsController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      size,
      perPage,
      streamId,
      stream,
      categoryId,
      category,
      secondcategoryId,
      secondCategoryId,
      secondaryCategoryId,
      secondcategory,
      secondCategory,
      subcategoryId,
      subCategoryId,
      subcategory,
      subCategory,
      country,
      state,
      excludeState,
      region,
      homeState,
      city,
      district,
      type,
      institute_type,
      instituteType,
      is_top,
      isTop,
      search,
      q,
      sortBy,
      sortOrder,
    } = req.query;

    const queryOptions = {
      page: Number(page) || 1,
      limit: Number(limit || size || perPage) || 20,
      streamId: streamId || stream || null,
      categoryId: categoryId || category || null,
      secondcategoryId:
        secondcategoryId ||
        secondCategoryId ||
        secondaryCategoryId ||
        secondcategory ||
        secondCategory ||
        null,
      subcategoryId:
        subcategoryId ||
        subCategoryId ||
        subcategory ||
        subCategory ||
        null,
      country: country || "",
      // region=inside|outside is a shortcut for state / excludeState = homeState
      state: state || (region === "inside" ? homeState || "Odisha" : ""),
      excludeState:
        excludeState || (region === "outside" ? homeState || "Odisha" : ""),
      city: city || "",
      district: district || "",
      type: type || institute_type || instituteType || "",
      is_top: is_top !== undefined ? is_top : isTop,
      search: search || q || "",
      sortBy: sortBy || "is_top",
      sortOrder: sortOrder || "desc",
    };

    const result = await getPaginatedInstitutions(queryOptions);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("❌ getPaginatedInstitutionsController Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// States dropdown for the institutions filter: every state that has data for
// the current category / type / search filters, with counts, plus the
// inside / outside home-state totals (default home state: Odisha).
export const getInstitutionStatesController = async (req, res) => {
  try {
    const {
      streamId,
      stream,
      categoryId,
      category,
      secondcategoryId,
      secondCategoryId,
      subcategoryId,
      subCategoryId,
      type,
      institute_type,
      is_top,
      search,
      q,
      homeState,
    } = req.query;

    const result = await getInstitutionStates(
      {
        streamId: streamId || stream || null,
        categoryId: categoryId || category || null,
        secondcategoryId: secondcategoryId || secondCategoryId || null,
        subcategoryId: subcategoryId || subCategoryId || null,
        type: type || institute_type || "",
        is_top,
        search: search || q || "",
      },
      homeState || "Odisha"
    );

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("❌ getInstitutionStatesController Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
