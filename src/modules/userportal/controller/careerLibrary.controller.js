import {
  getCategories,
  getSecondCategories,
  getSubCategories,
  getDetails,
  getNextLevel,
} from "../services/careerLibrary.service.js";

export const getCategoriesController = async (req, res) => {
  const result = await getCategories();
  res.status(result.success ? 200 : 400).json(result);
};

export const getSecondCategoriesController = async (req, res) => {
  const result = await getSecondCategories(req, req.params.categoryId);
  res.status(result.success ? 200 : 403).json(result);
};

export const getSubCategoriesController = async (req, res) => {
  const result = await getSubCategories(req, req.params.secondcategoryId);
  res.status(result.success ? 200 : 403).json(result);
};

export const getDetailsController = async (req, res) => {
  const result = await getDetails(req, req.params.subcategoryId);
  res.status(result.success ? 200 : 403).json(result);
};

export const getNextLevelController = async (req, res) => {
  const { type, id } = req.params;
  const result = await getNextLevel(req, type, id);
  res.status(result.success ? 200 : 403).json(result);
};
