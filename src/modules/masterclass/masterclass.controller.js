import {
  createMasterClass,
  getMasterClasses,
  getMasterClassById,
  updateMasterClass,
  deleteMasterClass,
  updateMasterClassFreeStatus,
} from "./masterclass.service.js";

// CREATE
export const createMasterClassController = async (req, res) => {
  const result = await createMasterClass(req.body, req.file);
  res.status(result.success ? 201 : 400).json(result);
};

// GET ALL
export const getMasterClassesController = async (
  req,
  res
) => {
  const userId = req.user?.id || null;

  const moduleId = req.headers["x-module-id"]
    ? Number(req.headers["x-module-id"])
    : null;

  const result = await getMasterClasses(
    userId,
    moduleId
  );

  res.status(200).json(result);
};
// GET BY ID
export const getMasterClassByIdController = async (req, res) => {
  const result = await getMasterClassById(
  req.params.id,
  req
);
  res.status(result.success ? 200 : 404).json(result);
};

// UPDATE
export const updateMasterClassController = async (req, res) => {
  const result = await updateMasterClass(
    req.params.id,
    req.body,
    req.file
  );

  res
    .status(result.success ? 200 : 400)
    .json(result);
};

// DELETE
export const deleteMasterClassController = async (req, res) => {
  const result = await deleteMasterClass(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};

export const updateMasterClassFreeStatusController =
  async (req, res) => {
    const result =
      await updateMasterClassFreeStatus(
        req.params.id,
        req.body.is_free
      );

    res
      .status(result.success ? 200 : 400)
      .json(result);
  };