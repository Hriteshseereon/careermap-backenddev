import prisma from "../../config/db.js";

export const StudyAbroadRepository = {
  create(data) {
    return prisma.studyAbroad.create({ data });
  },

  findAll() {
    return prisma.studyAbroad.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id) {
    return prisma.studyAbroad.findUnique({
      where: { id },
    });
  },

  update(id, data) {
    return prisma.studyAbroad.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.studyAbroad.delete({
      where: { id },
    });
  },
};

export const StudyAbroadConsultRepository = {
  create(data) {
    return prisma.studyAbroadConsult.create({
      data,
    });
  },

  findAll() {
    return prisma.studyAbroadConsult.findMany({
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

        studyAbroad: {
          select: {
            id: true,
            title: true,
            country_name: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id) {
    return prisma.studyAbroadConsult.findUnique({
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

        studyAbroad: true,
      },
    });
  },

  update(id, data) {
    return prisma.studyAbroadConsult.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.studyAbroadConsult.delete({
      where: { id },
    });
  },
};