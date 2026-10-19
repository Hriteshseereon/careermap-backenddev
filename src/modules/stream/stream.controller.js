import {
  createStream,
  getStreams,
  updateStream,
  deleteStream,
} from "./stream.service.js";

export const createStreamController = async (req, res) => {
  const result = await createStream(req.body, req.file);
  res.status(result.success ? 201 : 400).json(result);
};

export const getStreamsController = async (req, res) => {
  const result = await getStreams();
  res.status(200).json(result);
};

export const updateStreamController = async (req, res) => {
  const result = await updateStream(req.params.id, req.body, req.file);
  res.status(result.success ? 200 : 400).json(result);
};

export const deleteStreamController = async (req, res) => {
  const result = await deleteStream(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};