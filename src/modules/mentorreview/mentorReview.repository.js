import prisma from "../../config/db.js";

export const MentorReviewRepository = {

  create(data) {
    return prisma.mentorReview.create({
      data,
    });
  },

  findByBooking(bookingId) {
    return prisma.mentorReview.findUnique({
      where: {
        bookingId: Number(bookingId),
      },
    });
  },

  getMentorReviews(mentorId) {
    return prisma.mentorReview.findMany({
      where: {
        mentorId: Number(mentorId),
      },

      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

};