import prisma from "../../config/db.js";

export const StaffRepository = {

  create(data) {
    return prisma.staffUser.create({
      data,
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  },

  findByEmail(email) {
    return prisma.staffUser.findUnique({
      where: {
        email,
      },

      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  },

  // Only for the login password check (the service strips the password before responding).
  findByEmailWithPassword(email) {
    return prisma.staffUser.findUnique({
      where: {
        email,
      },
      omit: { password: false },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  },

  findAll() {
    return prisma.staffUser.findMany({
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id) {
    return prisma.staffUser.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  },

  update(id, data) {
    return prisma.staffUser.update({
      where: {
        id: Number(id),
      },
      data,
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  },

  delete(id) {
    return prisma.staffUser.delete({
      where: {
        id:Number(id),
      },
    });
  }

};