import prisma from "../../config/db.js";

export const UserLoginHistoryRepository = {

  create(data) {
    return prisma.userLoginHistory.create({
      data,
    });
  },

  findAll() {
    return prisma.userLoginHistory.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
          },
        },
      },
      orderBy: {
        loginAt: "desc",
      },
    });
  },

  findById(id) {
    return prisma.userLoginHistory.findUnique({
      where: { id },

      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
          },
        },
      },
    });
  },
};