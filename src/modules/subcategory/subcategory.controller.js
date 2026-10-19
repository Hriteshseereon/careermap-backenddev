import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  getSubBySecondCategory
} from "./subcategory.service.js";

// CREATE
export const createSubCategoryController = async (req, res) => {
  const result = await createSubCategory(req.body, req.files);
  res.status(result.success ? 201 : 400).json(result);
};

// GET ALL
export const getSubCategoriesController = async (req, res) => {
  const result = await getSubCategories();
  res.status(200).json(result);
};

// GET BY ID
export const getSubCategoryByIdController = async (req, res) => {
  const result = await getSubCategoryById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

// UPDATE
export const updateSubCategoryController = async (req, res) => {
  const result = await updateSubCategory(
    req.params.id,
    req.body,
    req.files
  );
  res.status(result.success ? 200 : 400).json(result);
};

// DELETE
export const deleteSubCategoryController = async (req, res) => {
  const result = await deleteSubCategory(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};  

export const getSubBySecondCategoryController = async (req, res) => {

  const result =
    await getSubBySecondCategory(req.params.secondcategoryId);

  res.status(result.success ? 200 : 400).json(result);
};