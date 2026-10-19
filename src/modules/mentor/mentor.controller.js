import {
  createMentor,
  getMentors,
  getMentorById,
  updateMentor,
  deleteMentor,
} from "./mentor.service.js";

// 🔹 CREATE
export const createMentorController = async (req, res) => {
  const result = await createMentor(req.body, req.files);
  res.status(result.success ? 201 : 400).json(result);
};

// 🔹 GET ALL
export const getMentorsController = async (req, res) => {
  const result = await getMentors();
  res.status(200).json(result);
};

// 🔹 GET BY ID
export const getMentorByIdController = async (req, res) => {
  const result = await getMentorById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

// 🔹 UPDATE
export const updateMentorController = async (req, res) => {
  const result = await updateMentor(
    req.params.id,
    req.body,
    req.files
  );
  res.status(result.success ? 200 : 400).json(result);
};

// 🔹 DELETE
export const deleteMentorController = async (req, res) => {
  const result = await deleteMentor(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};