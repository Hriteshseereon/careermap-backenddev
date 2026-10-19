import * as service from "./entranceexam.service.js";

export const create = async (req, res) => {
  const result = await service.createExam(req.body);
  res.status(result.success ? 201 : 400).json(result);
};

export const getAll = async (req, res) => {
  const result = await service.getAllExam();
  res.status(200).json(result);
};

export const getById = async (req, res) => {
  const result = await service.getExamById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

export const update = async (req, res) => {
  const result = await service.updateExam(req.params.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
};

export const remove = async (req, res) => {
  const result = await service.deleteExam(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};