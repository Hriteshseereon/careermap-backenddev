import {
  createDetails,
  getAllDetails,
  getDetailsById,
  updateDetails,
  deleteDetails
} from "./details.service.js";

export const createDetailsController = async (req, res) => {
  const result = await createDetails(req.body,req.file);
  res.status(result.success ? 201 : 400).json(result);
};

export const getAllDetailsController = async (req, res) => {
  const result = await getAllDetails();
  res.status(200).json(result);
};

export const getDetailsByIdController = async (req, res) => {
  const result = await getDetailsById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

export const updateDetailsController = async (req, res) => {
  const result = await updateDetails(req.params.id, req.body,req.file);
  res.status(result.success ? 200 : 400).json(result);
};

export const deleteDetailsController = async (req, res) => {
  const result = await deleteDetails(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};