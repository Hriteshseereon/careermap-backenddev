import {
  createSendMessage,
  getSendMessages,
  getSendMessageById,
  getUserMessages,
  updateSendMessageStatus,
  deleteSendMessage,
} from "./sendmessage.service.js";

export const createSendMessageController = async (req, res) => {
  const userId = req.user?.id || req.body?.userId || req.body?.user_id;
  const result = await createSendMessage(userId, req.body);

  return res.status(result.success ? 201 : 400).json(result);
};

export const getSendMessagesController = async (req, res) => {
  const result = await getSendMessages(req.query);

  return res.status(result.success ? 200 : 400).json(result);
};

export const getSendMessageByIdController = async (req, res) => {
  const result = await getSendMessageById(req.params.id);

  return res.status(result.success ? 200 : 404).json(result);
};

export const getMyMessagesController = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await getUserMessages(userId);

  return res.status(result.success ? 200 : 400).json(result);
};

export const updateSendMessageStatusController = async (req, res) => {
  const result = await updateSendMessageStatus(req.params.id, req.body);

  return res.status(result.success ? 200 : 400).json(result);
};

export const deleteSendMessageController = async (req, res) => {
  const result = await deleteSendMessage(req.params.id);

  return res.status(result.success ? 200 : 400).json(result);
};
