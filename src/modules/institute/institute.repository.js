import prisma from "../../config/db.js";

export const InstituteRepository = {

  create(data) {
    return prisma.institutes.create({
      data,
    });
  },

  findAll() {
    return prisma.institutes.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id) {
    return prisma.institutes.findUnique({
      where: {
        id: Number(id),
      },
    });
  },

  findByEmail(email) {
    return prisma.institutes.findUnique({
      where: {
        email,
      },
    });
  },

  // Only for the login password check. Never return the result to a client.
  findByEmailWithPassword(email) {
    return prisma.institutes.findUnique({
      where: {
        email,
      },
      omit: { password: false },
    });
  },

  update(id, data) {
    return prisma.institutes.update({
      where: {
        id: Number(id),
      },
      data,
    });
  },

  delete(id) {
    return prisma.institutes.delete({
      where: {
        id: Number(id),
      },
    });
  },
  getDashboardData(instituteId) {

  return prisma.users.findMany({
    where: {
      instituteId: Number(instituteId),
    },

    include: {
      quizattempt: true,
    },
  });

},
};