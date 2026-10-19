import prisma from "../../config/db.js";

export const NotificationRepository = {

  // 🔥 CREATE
  create(data) {
    return prisma.notification.create({
      data,
    });
  },

  // 🔥 GET ALL
  findAll() {
    return prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // 🔥 GET BY ID
  findById(id) {
    return prisma.notification.findUnique({
      where: { id },
    });
  },

  // 🔥 UPDATE
  update(id, data) {
    return prisma.notification.update({
      where: { id },
      data,
    });
  },

  // 🔥 USER NOTIFICATION
  getUserNotifications() {

    const tenDaysAgo = new Date();

    tenDaysAgo.setDate(
      tenDaysAgo.getDate() - 10
    );

    return prisma.notification.findMany({

      where: {
        createdAt: {
          gte: tenDaysAgo,
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },
};