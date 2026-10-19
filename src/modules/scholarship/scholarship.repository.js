import prisma from "../../config/db.js";

export const ScholarshipRepository = {
create(data) {
    return prisma.scholarship.create({
      data,
      include: {
        sections: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });
  },

  findAll() {
  return prisma.scholarship.findMany({
    include: {
      category: true,
      secondcategory: true,
      subcategory: true,
      sections: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
},

  findById(id) {
  return prisma.scholarship.findUnique({
    where: { id },
    include: {
      category: true,
      secondcategory: true,
      subcategory: true,
       sections: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
},

  findByName(name) {   // ✅ for unique check
    return prisma.scholarship.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // case-insensitive
        },
      },
    });
  },

 update(id, data) {
  return prisma.scholarship.update({
    where: { id },
    data,
    include: {
      sections: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
},

  delete(id) {
    return prisma.scholarship.delete({
      where: { id },
    });
  },
  updateFreeStatus(id, is_free) {
  return prisma.scholarship.update({
    where: {
      id: Number(id),
    },
    data: {
      is_free,
    },
  });
},
};