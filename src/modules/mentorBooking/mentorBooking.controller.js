import {
  createMentorOrder,
  verifyMentorPayment,
  getMyBookings,
  getAllBookings,
  getBookedSlots,
  getUserMentorBookings,
  getUserSubscriptions,
} from "./mentorBooking.service.js";

export const createOrderController =
async (req, res) => {

  try {

    const result =
      await createMentorOrder(
        req.user.id,
        req.body
      );

    res.json({
      success: true,
      ...result,
      key:
        process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPaymentController =
async (req, res) => {

  try {

    await verifyMentorPayment(
      req.user.id,
      req.body
    );

    res.json({
      success: true,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const myBookingsController =
async (req, res) => {

  const result =
    await getMyBookings(
      req.user.id
    );

  res.json(result);
};

export const allBookingsController =
async (req, res) => {

  const result =
    await getAllBookings();

  res.json(result);
};

export const getBookedSlotsController =
async (req, res) => {

  const result =
    await getBookedSlots(
      req.query.mentorId,
      req.query.date
    );

  res.json(result);
};

export const userMentorBookingsController =
async (req, res) => {

  const result =
    await getUserMentorBookings(
      req.user.id
    );

  res.json(result);
};

export const getUserSubscriptionsController =
async (req, res) => {

  const result =
    await getUserSubscriptions(
      req.user.id
    );

  res.json(result);
};