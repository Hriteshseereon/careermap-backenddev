import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} from "./plans.service.js";

export const createPlanController = async (req, res) => {
  const result = await createPlan(req.body);
  res.status(result.success ? 201 : 400).json(result);
};

export const getPlansController = async (req, res) => {
  const result = await getPlans();
  res.status(200).json(result);
};

export const getPlanByIdController = async (req, res) => {
  const result = await getPlanById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

export const updatePlanController = async (req, res) => {
  const result = await updatePlan(req.params.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
};

export const deletePlanController = async (req, res) => {
  const result = await deletePlan(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};