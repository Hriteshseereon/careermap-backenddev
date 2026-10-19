
import prisma from "../../../config/db.js";
import { createOrder,verifyPayment } from "../services/payment.service.js";


export const createOrderController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;

    const order = await createOrder(userId, planId);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const verifyPaymentController = async (req, res) => {
  try {
    const userId = req.user.id;
    await verifyPayment(userId, req.body);

    res.json({
      success: true,
      message: "Payment successful",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};