import prisma from "../../config/db.js";

export const MentorRepository = {
  create(data) {
    return prisma.mentor.create({ data });
  },

  findAll() {
    return prisma.mentor.findMany({
      include: {
        category: true,
        subcategory: true,
        secondcategory: true,
        availability:true,
          reviews: {
        select: {
          rating: true,
        },
      },
      },
    });
  },

  findById(id) {
    const today = new Date();
  today.setHours(0, 0, 0, 0); 
    return prisma.mentor.findUnique({

      where: { id },
      include: {
        category: true,
       availability: {
        where: {
          date: {
            gte: today,
          },
        },
        orderBy: {
          date: "asc",
        },
      },
         reviews: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      },
    });
  },

  update(id, data) {
    return prisma.mentor.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.mentor.delete({
      where: { id },
    });
  },
  
findByName(name) {
  return prisma.mentor.findFirst({
    where: {
      name: name,
    },
  });
}
};