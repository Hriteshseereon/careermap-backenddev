import {
  createCareerNewsletter,
  getCareerNewsletters,
  getCareerNewsletterById,
  updateCareerNewsletter,
  deleteCareerNewsletter,
} from "./careernewsletter.service.js";
export const createCareerNewsletterController = async (req, res) => {
  const result = await createCareerNewsletter(req.body, req.file);

  res.status(result.success ? 201 : 400).json(result);
};

export const getCareerNewslettersController = async (req, res) => {
  const result = await getCareerNewsletters();

  res.status(result.success ? 200 : 400).json(result);
};

export const getCareerNewsletterByIdController = async (req, res) => {
  const result = await getCareerNewsletterById(req.params.id);

  res.status(result.success ? 200 : 404).json(result);
};

export const updateCareerNewsletterController = async (req, res) => {
  const result = await updateCareerNewsletter(
    req.params.id,
    req.body,
    req.file
  );

  res.status(result.success ? 200 : 400).json(result);
};

export const deleteCareerNewsletterController = async (req, res) => {
  const result = await deleteCareerNewsletter(req.params.id);

  res.status(result.success ? 200 : 400).json(result);
};