import razorpay from "../../lib/razorpay.js";
import prisma from "../../config/db.js";
import crypto from "crypto";
import { MentorBookingRepository } from "./mentorBooking.repository.js";
import { sendMentorBookingMail } from "../../utils/sendMentorBookingMail.js";
export const createMentorOrder = async (
  userId,
  body
) => {

  const { mentorId, date, timeSlot } = body;

  const existing =
    await prisma.mentorbooking.findFirst({
      where: {
        mentorId: Number(mentorId),
        date: new Date(date),
        timeSlot,
      },
    });

  if (existing) {
    throw new Error(
      "This slot is already booked"
    );
  }

  const mentor =
    await MentorBookingRepository.findMentor(
      mentorId
    );

  const amount =
    Number(mentor.mentor_fees);

  const order =
    await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `mentor_${Date.now()}`,
    });

  return {
    order,

    mentorId,
    date,
    timeSlot,

    amount,
  };
};
const mentorSignatureMatches = (orderId, paymentId, signature) => {
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

export const verifyMentorPayment =
async (userId, body) => {

  // Security: a booking is only confirmed for a genuine Razorpay payment
  // (both the web portal and the mobile app send these three fields).
  if (
    !mentorSignatureMatches(
      body?.razorpay_order_id,
      body?.razorpay_payment_id,
      body?.razorpay_signature
    )
  ) {
    throw new Error(
      "Payment verification failed"
    );
  }

  // One Razorpay order can confirm only one booking.
  const alreadyUsed =
    await prisma.mentorpayment.findFirst({
      where: {
        orderId: String(body.razorpay_order_id),
      },
      select: { id: true },
    });

  if (alreadyUsed) {
    throw new Error(
      "This payment has already been used for a booking"
    );
  }

  const existing =
    await prisma.mentorbooking.findFirst({

      where: {
        mentorId: Number(body.mentorId),
        date: new Date(body.date),
        timeSlot: body.timeSlot,
      },
    });

  if (existing) {
    throw new Error(
      "Slot already booked"
    );
  }

  // mentor fee fetch karo
  const mentor =
    await prisma.mentor.findUnique({
      where: {
        id: Number(body.mentorId),
      },
    });

  if (!mentor) {
    throw new Error(
      "Mentor not found"
    );
  }

  const amount =
    Number(mentor.mentor_fees);

  // 🔥 CREATE BOOKING FIRST
  const booking =
    await prisma.mentorbooking.create({

      data: {

        userId,

        mentorId:
          Number(body.mentorId),

        date:
          new Date(body.date),

        timeSlot:
          body.timeSlot,

        amount,

        status:
          "confirmed",

        paymentStatus:
          "paid",
      },
    });
  // 🔥 THEN CREATE PAYMENT
  await prisma.mentorpayment.create({

    data: {

      bookingId:
        booking.id,

      userId,

      amount,

      orderId:
        body.razorpay_order_id,

      paymentId:
        body.razorpay_payment_id,

      status:
        "paid",
    },
  });

  // Confirmation mails: a mail outage must not turn a paid, confirmed booking into an error
  // (previously the payment row was never written when the mail failed).
  try {
    const user =
      await MentorBookingRepository.getUser(
        userId
      );

    await sendMentorBookingMail(
      user,
      mentor,
      booking
    );
  } catch (mailError) {
    console.error("❌ Mentor booking mail error:", mailError.message);
  }

  return booking;
};
export const getMyBookings =
async (userId) => {

  const bookings =
    await MentorBookingRepository.getMyBookings(
      userId
    );

  return {
    success: true,
    data: bookings,
  };
};

export const getAllBookings =
async () => {

  const data =
    await MentorBookingRepository.getAllBookings();

  return {
    success: true,
    data,
  };
};

export const getBookedSlots = async (
  mentorId,
  date
) => {

  const slots =
    await MentorBookingRepository.getBookedSlots(
      mentorId,
      date
    );

  return {
    success: true,
    data: slots.map(
      (s) => s.timeSlot
    ),
  };
};

export const getUserMentorBookings =
async (userId) => {

  const data =
    await MentorBookingRepository.getUserMentorBookings(
      userId
    );

  const bookings = data.map((item) => ({

    ...item,

    canReview:

      new Date(item.date) < new Date() &&

      item.status === "confirmed" &&

      !item.reviewSubmitted

  }));

  return {
    success: true,
    data: bookings,
  };
};

export const getUserSubscriptions =
async (userId) => {

  const data =
    await MentorBookingRepository.getUserSubscriptions(
      userId
    );

  return {
    success: true,
    data,
  };
};