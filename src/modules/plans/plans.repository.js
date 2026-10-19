import prisma from "../../config/db.js";

export const PlansRepository = {
  create(data) {
    return prisma.plans.create({ data });
  },

  findAll() {
    return prisma.plans.findMany({
      include: {
        modules: true, // ✅ include relation
      },
    });
  },

  findById(id) {
    return prisma.plans.findUnique({
      where: { id },
      include: {
        modules: true,
      },
    });
  },

  findByName(name) {
    return prisma.plans.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  },

  update(id, data) {
    return prisma.plans.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.plans.delete({
      where: { id },
    });
  },
};