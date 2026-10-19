import prisma from "../../config/db.js";

export const AdminNotificationRepository = {
  async getBirthdayMentors() {
    return prisma.mentor.findMany({
      where: {
        dateof_birth: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        dateof_birth: true,
      },
    });
  },

  async getExpiredEntranceExams() {
    return prisma.entranceExam.findMany({
      where: {
        lastdate: {
          lt: new Date(),
        },
      },
      select: {
        id: true,
        examname: true,
        lastdate: true,
      },
    });
  },
};