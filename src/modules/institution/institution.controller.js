import { createInstitution,updateInstitution,getInstitutions,deleteInstitution,getInstitutionById,  getPaginatedInstitutions, } from "./institution.service.js";

export const createInstitutionController = async (req, res) => {
  const result = await createInstitution(req.body, req.file);
  res.status(result.success ? 201 : 400).json(result);
};

export const getInstitutionsController = async (req, res) => {
  const result = await getInstitutions();
  res.status(200).json(result);
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

export const getPaginatedInstitutionsController = async (
  req,
  res
) => {
  try {
    const {
      page = 1,
      limit = 30,
      country = "",
      state = "",
      type = "",
      category = "",
      categoryId = "",
    } = req.query;

    const result = await getPaginatedInstitutions(
      page,
      limit,
      country,
      state,
      type,
      category || categoryId
    );

    return res.status(result.success ? 200 : 400).json(result);

  } catch (error) {
    console.error(
      "❌ getPaginatedInstitutionsController Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};