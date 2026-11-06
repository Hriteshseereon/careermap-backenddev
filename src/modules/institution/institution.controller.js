import {
  createInstitution,
  updateInstitution,
  getInstitutions,
  deleteInstitution,
  getInstitutionById,
  getPaginatedInstitutions,
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
      state: state || "",
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
