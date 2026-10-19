import prisma from "../../config/db.js";

export const MentorBookingRepository = {

  createBooking(data) {
    return prisma.mentorbooking.create({
      data,
    });
  },

  createPayment(data) {
    return prisma.mentorpayment.create({
      data,
    });
  },

  findMentor(id) {
    return prisma.mentor.findUnique({
      where: {
        id: Number(id),
      },
    });
  },

  findBooking(id) {
    return prisma.mentorbooking.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        mentor: true,
        user: true,
        payment: true,
      },
    });
  },

  updateBooking(id, data) {
    return prisma.mentorbooking.update({
      where: {
        id: Number(id),
      },
      data,
    });
  },

  updatePayment(bookingId, data) {
    return prisma.mentorpayment.update({
      where: {
        bookingId: Number(bookingId),
      },
      data,
    });
  },

  getMyBookings(userId) {
    return prisma.mentorbooking.findMany({
      where: {
        userId,
      },

      include: {
        mentor: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getAllBookings() {
    return prisma.mentorbooking.findMany({
      include: {
        mentor: true,
        user: true,
        payment: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },
    getBookedSlots(mentorId, date) {
  return prisma.mentorbooking.findMany({
    where: {
      mentorId: Number(mentorId),
      date: new Date(date),
      status: "confirmed",
    },

    select: {
      timeSlot: true,
    },
  });
},
getUserMentorBookings(userId) {
  return prisma.mentorbooking.findMany({
    where: {
      userId: Number(userId),
    },

    include: {
      mentor: true,
      payment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
},
getUserSubscriptions(userId) {
  return prisma.subscriptions.findMany({
    where: {
      userId: Number(userId),
    },

    include: {
      plan: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
},
getUser(userId) {
  return prisma.users.findUnique({
    where: {
      id: Number(userId),
    },
  });
},

getMentor(mentorId) {
  return prisma.mentor.findUnique({
    where: {
      id: Number(mentorId),
    },
  });
},
};