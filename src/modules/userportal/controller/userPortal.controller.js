import { getDashboardData } from "../services/userPortal.service.js";

export const getDashboardController = async (req, res) => {
  const userId = req.user.id; // from auth middleware

  const result = await getDashboardData(userId);

  res.status(result.success ? 200 : 400).json(result);
};