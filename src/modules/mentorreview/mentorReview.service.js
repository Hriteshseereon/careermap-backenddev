import {MentorReviewRepository} from "./mentorReview.repository.js"
import prisma from "../../config/db.js";
export const createReview =
async (userId, body) => {

  const booking =
    await prisma.mentorbooking.findUnique({
      where: {
        id: Number(body.bookingId),
      },
    });

  if (!booking) {
    return {
      success: false,
      message: "Booking not found",
    };
  }

  if (booking.userId !== userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const existing =
    await MentorReviewRepository.findByBooking(
      body.bookingId
    );

  if (existing) {
    return {
      success: false,
      message:
        "Review already submitted",
    };
  }

  const review =
    await MentorReviewRepository.create({

      mentorId:
        booking.mentorId,

      userId,

      bookingId:
        booking.id,

      rating:
        Number(body.rating),

      review:
        body.review,
    });

  await prisma.mentorbooking.update({
    where: {
      id: booking.id,
    },

    data: {
      reviewSubmitted: true,
    },
  });

  return {
    success: true,
    data: review,
  };
};
export const getMentorReviews =
async (mentorId) => {

  const reviews =
    await MentorReviewRepository.getMentorReviews(
      mentorId
    );

  const totalReviews =
    reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (sum, item) =>
              sum + item.rating,
            0
          ) / totalReviews
        ).toFixed(1)
      : 0;

  return {
    success: true,

    averageRating,

    totalReviews,

    data: reviews,
  };
};

