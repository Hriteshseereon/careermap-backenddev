import prisma from "../../config/db.js";

export const CategoryRepository = {
  create(data) {
    return prisma.category.create({
      data,
    });
  },

  findAll() {
    return prisma.category.findMany({
      include: {
        stream: true,
        secondCategories: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
        subcategories: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
  },

  findById(id) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        stream: true,
        
        secondCategories: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
        subcategories: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
      },
    });
  },

  update(id, data) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.category.delete({
      where: { id },
    });
  },

  getByStreamId(streamId) {
  return prisma.category.findMany({
    where: {
      streamId: Number(streamId),
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
},
updatePreviewAccess(id, category_access) {
  return prisma.category.update({
    where: { id: Number(id) },
    data: {
      category_access,
    },
  });
},
  findByTitle(title) {
    return prisma.category.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive", // Case-insensitive search
        },
      },
    });
  },
};
