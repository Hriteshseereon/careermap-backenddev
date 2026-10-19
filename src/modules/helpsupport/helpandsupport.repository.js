import prisma from "../../config/db.js";

export const HelpAndSupportRepository = {

  create(data) {
    return prisma.helpAndSupport.create({
      data,
    });
  },

  findAll() {
    return prisma.helpAndSupport.findMany({
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
        createdAt: "desc",
      },
    });
  },

  findById(id) {
    return prisma.helpAndSupport.findUnique({
      where: { id },

      include: {
        user: true,
      },
    });
  },

  update(id, data) {
    return prisma.helpAndSupport.update({
      where: { id },
      data,
    });
  },
};