import { NotificationRepository } from "./notification.repository.js";

// 🔥 CREATE
export const createNotification = async (body) => {

  try {

    const data =
      await NotificationRepository.create({

        title: body.title,

        message: body.message,

        target: body.target,

        status:
          body.status || "pending",

        type: body.type,
      });

    return {
      success: true,
      data,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 GET ALL
export const getNotifications = async () => {

  try {

    const data =
      await NotificationRepository.findAll();

    return {
      success: true,
      data,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 GET BY ID
export const getNotificationById = async (id) => {

  try {

    const data =
      await NotificationRepository.findById(
        Number(id)
      );

    if (!data) {

      return {
        success: false,
        message: "Notification not found",
      };
    }

    return {
      success: true,
      data,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 UPDATE
export const updateNotification = async (
  id,
  body
) => {

  try {

    const updated =
      await NotificationRepository.update(
        Number(id),
        {
          title:
            body.title !== undefined
              ? body.title
              : undefined,

          message:
            body.message !== undefined
              ? body.message
              : undefined,

          target:
            body.target !== undefined
              ? body.target
              : undefined,

          status:
            body.status !== undefined
              ? body.status
              : undefined,

          type:
            body.type !== undefined
              ? body.type
              : undefined,
        }
      );

    return {
      success: true,
      data: updated,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 USER API
export const getUserNotifications = async () => {

  try {

    const data =
      await NotificationRepository.getUserNotifications();

    return {
      success: true,
      data,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};