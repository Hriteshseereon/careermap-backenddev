import {
  createStudyAbroad,
  getStudyAbroad,
  getStudyAbroadById,
  updateStudyAbroad,
  deleteStudyAbroad,
   createStudyAbroadConsult,
  getStudyAbroadConsult,
  getStudyAbroadConsultById,
  updateStudyAbroadConsult,
  deleteStudyAbroadConsult,
} from "./studyabroad.service.js";

// CREATE
export const createStudyAbroadController = async (req, res) => {
  const result = await createStudyAbroad(req.body);
  res.status(result.success ? 201 : 400).json(result);
};

// GET ALL
export const getStudyAbroadController = async (req, res) => {
  const result = await getStudyAbroad();
  res.status(200).json(result);
};

// GET BY ID
export const getStudyAbroadByIdController = async (req, res) => {
  const result = await getStudyAbroadById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

// UPDATE
export const updateStudyAbroadController = async (req, res) => {
  const result = await updateStudyAbroad(req.params.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
};

// DELETE
export const deleteStudyAbroadController = async (req, res) => {
  const result = await deleteStudyAbroad(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};

export const createStudyAbroadConsultController = async (req, res) => {
  const result = await createStudyAbroadConsult(
    req.user.id,
    req.body
  );

  res.status(result.success ? 201 : 400).json(result);
};
// GET ALL
export const getStudyAbroadConsultController = async (req, res) => {
  const result = await getStudyAbroadConsult();

  res.status(200).json(result);
};

// GET BY ID
export const getStudyAbroadConsultByIdController = async (req, res) => {
  const result = await getStudyAbroadConsultById(req.params.id);

  res.status(result.success ? 200 : 404).json(result);
};

// UPDATE
export const updateStudyAbroadConsultController = async (req, res) => {
  const result = await updateStudyAbroadConsult(
    req.params.id,
    req.body
  );

  res.status(result.success ? 200 : 400).json(result);
};

// DELETE
export const deleteStudyAbroadConsultController = async (req, res) => {
  const result = await deleteStudyAbroadConsult(req.params.id);

  res.status(result.success ? 200 : 400).json(result);
};