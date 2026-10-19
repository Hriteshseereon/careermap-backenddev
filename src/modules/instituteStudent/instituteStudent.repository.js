import prisma from "../../config/db.js";

export const InstituteStudentRepository = {

  getInstitute(instituteId) {
    return prisma.institutes.findUnique({
      where: {
        id: Number(instituteId),
      },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });
  },

  findByEmail(email) {
    return prisma.users.findUnique({
      where: {
        email,
      },
    });
  },

  createStudent(data) {
    return prisma.users.create({
      data,
    });
  },

  getAllStudents() {
    return prisma.users.findMany({
      where: {
        instituteId: {
          not: null,
        },
      },

      include: {
        institute: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getStudentsByInstitute(instituteId) {
    return prisma.users.findMany({
      where: {
        instituteId: Number(instituteId),
      },

      include: {
        institute: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getStudentById(id) {
    return prisma.users.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        institute: true,
      },
    });
  },

  updateStudent(id, data) {
    return prisma.users.update({
      where: {
        id: Number(id),
      },
      data,
    });
  },

  deleteStudent(id) {
    return prisma.users.delete({
      where: {
        id: Number(id),
      },
    });
  },
};