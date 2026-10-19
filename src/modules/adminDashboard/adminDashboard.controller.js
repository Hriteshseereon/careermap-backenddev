import {
  getDashboardData,
  getAllTransactions,
  getAllMentorBookings,
} from "./adminDashboard.service.js";

export const getDashboardController =
async (req, res) => {

  try {

    const result =
      await getDashboardData();

    res.status(200).json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllTransactionsController = async (req, res) => {
  try {
    const result = await getAllTransactions();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllMentorBookingsController = async (req, res) => {
  try {
    const result = await getAllMentorBookings();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};