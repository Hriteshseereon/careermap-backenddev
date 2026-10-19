import {
  createScholarship,
  getScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  updateScholarshipFreeStatus,
} from "./scholarship.service.js";

export const createScholarshipController = async (req, res) => {
  const result = await createScholarship(req.body, req.file);
  res.status(result.success ? 201 : 400).json(result);
};

export const getScholarshipsController = async (req, res) => {
  const result = await getScholarships();
  res.status(200).json(result);
};

export const getScholarshipByIdController = async (req, res) => {
  const result = await getScholarshipById(req.params.id, req);
  res.status(result.success ? 200 : 403).json(result);
};

export const updateScholarshipController = async (req, res) => {
  const result = await updateScholarship(
    req.params.id,
    req.body,
    req.file
  );
  res.status(result.success ? 200 : 400).json(result);
};

export const deleteScholarshipController = async (req, res) => {
  const result = await deleteScholarship(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};
export const updateScholarshipFreeStatusController =
  async (req, res) => {
    const { is_free } = req.body;

    const result =
      await updateScholarshipFreeStatus(
        req.params.id,
        is_free
      );

    res.status(result.success ? 200 : 400).json(result);
  };