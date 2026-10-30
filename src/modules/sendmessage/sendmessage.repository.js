import prisma from "../../config/db.js";

export const SendMessageRepository = {
  create(data) {
    return prisma.sendMessage.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            mobile: true,
          },
        },
      },
    });
  },

  findAll(query = {}) {
    const where = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.userId) {
      where.userId = Number(query.userId);
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email_id: { contains: query.search, mode: "insensitive" } },
        { phone_no: { contains: query.search, mode: "insensitive" } },
        { message: { contains: query.search, mode: "insensitive" } },
      ];
    }

    return prisma.sendMessage.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
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
    return prisma.sendMessage.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            mobile: true,
          },
        },
      },
    });
  },

  findByUserId(userId) {
    return prisma.sendMessage.findMany({
      where: { userId: Number(userId) },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  update(id, data) {
    return prisma.sendMessage.update({
      where: { id: Number(id) },
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            mobile: true,
          },
        },
      },
    });
  },

  delete(id) {
    return prisma.sendMessage.delete({
      where: { id: Number(id) },
    });
  },
};
