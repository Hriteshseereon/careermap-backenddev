import prisma from "../../config/db.js";

export const pathTypeRepository = {
  create: (data) => prisma.pathType.create({ data }),

  findAll: () => prisma.pathType.findMany({
    include: { careerpath: true }
  }),

  findById: (id) => prisma.pathType.findUnique({
    where: { id },
    include: { careerpath: true }
  }),

  update: (id, data) => prisma.pathType.update({
    where: { id },
    data
  }),

  delete: (id) => prisma.pathType.delete({
    where: { id }
  })
};