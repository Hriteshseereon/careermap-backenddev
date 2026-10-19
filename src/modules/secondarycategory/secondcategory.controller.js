import {
  createSecondCategory,
  getSecondCategories,
  getSecondCategoryById,
  updateSecondCategory,
  deleteSecondCategory,
  getSecondByCategory
} from "./secondcategory.service.js";

export const createSecondCategoryController = async (req, res) => {
  const result = await createSecondCategory(req.body, req.files);
  res.status(result.success ? 201 : 400).json(result);
};

export const getSecondCategoriesController = async (req, res) => {
  const result = await getSecondCategories();
  res.json(result);
};

export const getSecondCategoryByIdController = async (req, res) => {
  const result = await getSecondCategoryById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

export const updateSecondCategoryController = async (req, res) => {
  const result = await updateSecondCategory(
    req.params.id,
    req.body,
    req.files
  );
  res.status(result.success ? 200 : 400).json(result);
};

export const deleteSecondCategoryController = async (req, res) => {
  const result = await deleteSecondCategory(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};
export const getSecondByCategoryController = async (req, res) => {

  const result =
    await getSecondByCategory(req.params.categoryId);

  res.status(result.success ? 200 : 400).json(result);
};