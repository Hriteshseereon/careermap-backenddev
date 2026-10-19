import {

  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  getUserNotifications,

} from "./notification.service.js";

// 🔥 CREATE
export const createNotificationController =
async (req, res) => {

  const result =
    await createNotification(req.body);

  res.status(
    result.success ? 201 : 400
  ).json(result);
};

// 🔥 GET ALL
export const getNotificationsController =
async (req, res) => {

  const result =
    await getNotifications();

  res.status(200).json(result);
};

// 🔥 GET BY ID
export const getNotificationByIdController =
async (req, res) => {

  const result =
    await getNotificationById(req.params.id);

  res.status(
    result.success ? 200 : 404
  ).json(result);
};

// 🔥 UPDATE
export const updateNotificationController =
async (req, res) => {

  const result =
    await updateNotification(
      req.params.id,
      req.body
    );

  res.status(
    result.success ? 200 : 400
  ).json(result);
};

// 🔥 USER API
export const getUserNotificationsController =
async (req, res) => {

  const result =
    await getUserNotifications();

  res.status(200).json(result);
};