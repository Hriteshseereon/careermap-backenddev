import prisma from "../../config/db.js";

export const entranceExamRepository = {
  create: (data) =>
    prisma.entranceExam.create({ data }),

  findAll: () =>
    prisma.entranceExam.findMany({
      include: {
        module: true,
        stream: true,
        category: true,
        secondcategory: true,
        subcategory: true,
        details: true,
      },
    }),

  findById: (id) =>
    prisma.entranceExam.findUnique({
      where: { id },
      include: {
        module: true,
        stream: true,
        category: true,
        secondcategory: true,
        subcategory: true,
        details: true,
      },
    }),

  findByExamName: (examname) =>
    prisma.entranceExam.findUnique({
      where: { examname },
    }),

  update: (id, data) =>
    prisma.entranceExam.update({
      where: { id },
      data,
    }),

  delete: (id) =>
    prisma.entranceExam.delete({
      where: { id },
    }),
};