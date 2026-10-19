import { getAdminNotifications } from "./adminnotification.service.js";

export const getAdminNotificationsController =
  async (req, res) => {
    const result =
      await getAdminNotifications();

    res
      .status(result.success ? 200 : 400)
      .json(result);
  };