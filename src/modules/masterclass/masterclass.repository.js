import prisma from "../../config/db.js";

export const MasterClassRepository = {
  create(data) {
    return prisma.masterClass.create({ data });
  },

  findAll() {
    return prisma.masterClass.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id) {
    return prisma.masterClass.findUnique({
      where: { id },
    });
  },

  update(id, data) {
    return prisma.masterClass.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.masterClass.delete({
      where: { id },
    });
  },
updateFreeStatus(id, is_free) {
  return prisma.masterClass.update({
    where: { id: Number(id) },
    data: { is_free },
  });
},
};