import prisma from "../../config/db.js";

export const AdminDashboardRepository = {

  getCounts() {
    return Promise.all([
      prisma.users.count(),
      prisma.mentor.count(),
      prisma.plans.count(),
      prisma.institutions.count(),
      prisma.quiz.count(),
    ]);
  },

  getLast30DaysSubscriptions(startDate) {
    return prisma.subscriptions.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  getLoginHistory(startDate) {
    return prisma.userLoginHistory.findMany({
      where: {
        loginAt: {
          gte: startDate,
        },
      },
      select: {
        loginAt: true,
      },
      orderBy: {
        loginAt: "asc",
      },
    });
  },

  getPlanSubscriptions() {
    return prisma.plans.findMany({
      include: {
        subscriptions: true,
      },
    });
  },

  getAllTransactions() {
    return prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getAllMentorBookings() {
    return prisma.mentorbooking.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
          },
        },
        mentor: {
          select: {
            id: true,
            name: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};