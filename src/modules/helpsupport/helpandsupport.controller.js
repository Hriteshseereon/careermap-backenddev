import {

  createHelpRequest,
  getHelpRequests,
  getHelpRequestById,
  updateHelpStatus,

} from "./helpandsupport.service.js";

export const createHelpRequestController =
async (req, res) => {

  const result =
    await createHelpRequest(
      req.user.id,
      req.body
    );

  res.status(
    result.success ? 201 : 400
  ).json(result);
};

export const getHelpRequestsController =
async (req, res) => {

  const result =
    await getHelpRequests();

  res.status(200).json(result);
};

export const getHelpRequestByIdController =
async (req, res) => {

  const result =
    await getHelpRequestById(
      req.params.id
    );

  res.status(
    result.success ? 200 : 404
  ).json(result);
};

export const updateHelpStatusController =
async (req, res) => {

  const result =
    await updateHelpStatus(
      req.params.id,
      req.body
    );

  res.status(
    result.success ? 200 : 400
  ).json(result);
};