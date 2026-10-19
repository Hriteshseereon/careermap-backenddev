import { HelpAndSupportRepository } from "./helpandsupport.repository.js";

export const createHelpRequest = async (
  userId,
  body
) => {

  try {

    const data =
      await HelpAndSupportRepository.create({

        userId,

        email: body.email,

        subject: body.subject,

        message: body.message,

        status: "pending",
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

export const getHelpRequests = async () => {

  try {

    const data =
      await HelpAndSupportRepository.findAll();

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

export const getHelpRequestById = async (
  id
) => {

  try {

    const data =
      await HelpAndSupportRepository.findById(
        Number(id)
      );

    if (!data) {

      return {
        success: false,
        message: "Request not found",
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

export const updateHelpStatus = async (
  id,
  body
) => {

  try {

    const data =
      await HelpAndSupportRepository.update(
        Number(id),
        {
          status: body.status,
        }
      );

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