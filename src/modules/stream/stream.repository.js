import prisma from "../../config/db.js";

export const StreamRepository = {
  create(data) {
    return prisma.stream.create({ data });
  },

  findAll() {
    return prisma.stream.findMany();
  },

  findById(id) {
    return prisma.stream.findUnique({ where: { id } });
  },
  findByName(name) {
  return prisma.stream.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
},

  update(id, data) {
    return prisma.stream.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.stream.delete({
      where: { id },
    });
  },
};