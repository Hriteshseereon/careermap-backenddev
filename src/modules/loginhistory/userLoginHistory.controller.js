import {

  createLoginHistory,
  getLoginHistory,
  getLoginHistoryById,

} from "./userLoginHistory.service.js";

export const createLoginHistoryController =
async (req, res) => {

  const result =
    await createLoginHistory(
      req.user.id,
      req.body
    );

  res
    .status(result.success ? 201 : 400)
    .json(result);
};

export const getLoginHistoryController =
async (req, res) => {

  const result =
    await getLoginHistory();

  res.status(200).json(result);
};

export const getLoginHistoryByIdController =
async (req, res) => {

  const result =
    await getLoginHistoryById(
      req.params.id
    );

  res
    .status(result.success ? 200 : 404)
    .json(result);
};