import prisma from "../../config/db.js";

export const SecondCategoryRepository = {
  create(data) {
    return prisma.secondcategory.create({ data });
  },

  findAll() {
    return prisma.secondcategory.findMany({
      include: {
        category: true,
        subcategories: true,
      },
    });
  },

  findById(id) {
    return prisma.secondcategory.findUnique({
      where: { id },
      include: {
        category: true,
        subcategories: true,
      },
    });
  },
findByCategoryId(categoryId) {
  return prisma.secondcategory.findMany({
    where: {
      categoryId: Number(categoryId),
    },
  });
},
  update(id, data) {
    return prisma.secondcategory.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.secondcategory.delete({
      where: { id },
    });
  },
};  