import prisma from "../../config/db.js";

export const RoleRepository = {

  create(data) {
    return prisma.role.create({
      data,
      include: {
        permissions: true,
      },
    });
  },

  findAll() {
    return prisma.role.findMany({
      include: {
        permissions: true,
        users: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id) {
    return prisma.role.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        permissions: true,
        users: true,
      },
    });
  },

  findByName(name) {
    return prisma.role.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  },

  update(id, data) {
    return prisma.role.update({
      where: {
        id: Number(id),
      },
      data,
      include: {
        permissions: true,
      },
    });
  },

  delete(id) {
    return prisma.role.delete({
      where: {
        id: Number(id),
      },
    });
  },
};