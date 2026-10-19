import razorpay from "../../../lib/razorpay.js";
import prisma from "../../../config/db.js";
import crypto from "crypto";

export const createOrder = async (userId, planId) => {
  planId = Number(planId);
  const plan = await prisma.plans.findUnique({
    where: { id: planId },
  });

  if (!plan) throw new Error("Plan not found");

  const order = await razorpay.orders.create({
    amount: Number(plan.price) * 100, // paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  // 🔥 store pending payment
  await prisma.payment.create({
    data: {
      userId,
      planId,
      amount: Number(plan.price),
      status: "pending",
      stripeId: order.id, // reuse field or rename
    },
  });

  return order;
};

const signatureMatches = (orderId, paymentId, signature) => {
  if (!orderId || !paymentId || !signature || !process.env.RAZORPAY_KEY_SECRET) {
    return false;
  }
  const expected = Buffer.from(
    crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex")
  );
  const received = Buffer.from(String(signature));
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};

export const verifyPayment = async (userId,body) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = body || {};

  if (!signatureMatches(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    throw new Error("Payment verification failed");
  }

  // The plan is the one this user's order was created for (never the planId sent by the client),
  // so paying for a cheap plan cannot unlock a more expensive one.
  const payment = await prisma.payment.findFirst({
    where: {
      stripeId: String(razorpay_order_id),
      userId: Number(userId),
    },
  });

  if (!payment) {
    throw new Error("Payment verification failed");
  }

  // Same order verified again (retry / replay): already processed, create nothing new.
  if (payment.status === "success") {
    return true;
  }

  // Claim the pending payment atomically so two concurrent verifications cannot both create a subscription.
  const claimed = await prisma.payment.updateMany({
    where: { id: payment.id, status: { not: "success" } },
    data: {
      status: "success",
    },
  });

  if (claimed.count === 0) {
    return true;
  }

  const planId = payment.planId;

  // get plan details
const plan = await prisma.plans.findUnique({
  where: { id: Number(planId) },
});
const validityDays =
  Number(plan?.validity) || 30;
const startDate = new Date();

const endDate = new Date();

endDate.setDate(
  endDate.getDate() +
   validityDays
);

// 🔥 create subscription
await prisma.subscriptions.create({
  data: {
    userId: Number(userId),
    planId: Number(planId),

    startDate,
    endDate,

    status: "active",
    amount: Number(plan?.price ?? payment.amount),
  },
});
  // 6 Mark user upgraded

   await prisma.users.update({
    where: {
      id: Number(userId),
    },
    data: {
      isupgraded: true,
    },
  });

  return true;
};
