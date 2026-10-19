import { UserLoginHistoryRepository } from "./userLoginHistory.repository.js";

export const createLoginHistory = async (
  userId,
  body
) => {
  try {

    const data =
      await UserLoginHistoryRepository.create({

        userId,

        ipAddress: body.ipAddress,

        location: body.location,

        device: body.device,

        browser: body.browser,

        os: body.os,
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

export const getLoginHistory = async () => {

  try {

    const data =
      await UserLoginHistoryRepository.findAll();

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

export const getLoginHistoryById = async (id) => {

  try {

    const data =
      await UserLoginHistoryRepository.findById(
        Number(id)
      );

    if (!data) {
      return {
        success: false,
        message: "History not found",
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