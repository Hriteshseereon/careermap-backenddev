import prisma from "../../config/db.js";

export const CareerNewsletterRepository = {

  create(data) {
    return prisma.careernewsletter.create({
      data,
    });
  },

  findAll() {
    return prisma.careernewsletter.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id) {
    return prisma.careernewsletter.findUnique({
      where: { id },
    });
  },

  findByTitle(title) {
    return prisma.careernewsletter.findUnique({
      where: { title },
    });
  },

  update(id, data) {
    return prisma.careernewsletter.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.careernewsletter.delete({
      where: { id },
    });
  },
};