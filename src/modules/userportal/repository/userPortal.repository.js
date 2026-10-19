import prisma from "../../../config/db.js";

export const UserPortalRepository = {
  getUserById(userId) {
    return prisma.users.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });
  },

  getModules() {
    return prisma.module.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  },

  async getMentors() {
  const mentors = await prisma.mentor.findMany({
    where: {
      status: true,
    },
    include: {
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  return mentors
    .map((mentor) => {
      const totalReviews = mentor.reviews.length;

      const averageRating =
        totalReviews > 0
          ? mentor.reviews.reduce(
              (sum, review) => sum + review.rating,
              0
            ) / totalReviews
          : 0;

      return {
        ...mentor,
        averageRating,
        totalReviews,
      };
    })
    .sort((a, b) => {
      // Highest rating first
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }

      // If ratings are equal, mentor with more reviews first
      if (b.totalReviews !== a.totalReviews) {
        return b.totalReviews - a.totalReviews;
      }

      // If still equal, latest mentor first
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 8);
},

  getScholarships() {
    return prisma.scholarship.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  },
getEntranceExams() {
  return prisma.entranceExam.findMany({
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  });
},
  getInstitutions() {
    return prisma.institutions.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  },
  getPlans(){
    return prisma.plans.findMany({
      take:8,
      orderBy: { createdAt: "desc" },
    })
  },
  getAvailability(mentorId) {
  return prisma.mentorAvailability.findMany({
    where: {
      mentorId: Number(mentorId),
      date: {
        gte: new Date(), // 🔥 only future
      },
    },
    orderBy: {
      date: "asc",
    },
  });
},

getBookings(mentorId) {
  return prisma.mentorbooking.findMany({
    where: {
      mentorId: Number(mentorId),
      status: "confirmed", // or paymentStatus: "paid"
    },

  });
},
  // 🔹 CATEGORY
  getAllCategories() {
    return prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  // 🔹 SECOND CATEGORY
  getSecondCategories(categoryId) {
    return prisma.secondcategory.findMany({
      where: { categoryId: Number(categoryId) },
      orderBy: { createdAt: "desc" },
    });
  },

  // 🔹 SUB CATEGORY
  getSubCategories(secondcategoryId) {
    return prisma.subcategory.findMany({
      where: { secondcategoryId: Number(secondcategoryId) },
      orderBy: { createdAt: "desc" },
    });
  },

  // 🔥 DETAILS BY SUBCATEGORY (DEEP LEVEL)
 getDetailsBySubCategory(subcategoryId) {
  return prisma.details.findMany({
    where: { subcategoryId: Number(subcategoryId) },

    include: {
      salaryRanges: true,

      stream: true,
      category: true,
      secondcategory: true,
      subcategory: true,

      // ✅ MANY TO MANY
      institutions: true,

      careerpaths: {
        include: {
          module: true,
          path: true,
        },
      },
      descriptions: {
  orderBy: {
    sortOrder: "asc",
  },
},
      entranceexams: true,
    },
  });
},

  // 🔥 DETAILS BY CATEGORY (DIRECT LEVEL)
 getDetailsByCategory(categoryId) {
  return prisma.details.findMany({
    where: {
      categoryId: Number(categoryId),
      subcategoryId: null,
      secondcategoryId: null,
    },

    include: {
      salaryRanges: true,

      stream: true,
      category: true,

      institutions: true,
      descriptions: {
  orderBy: {
    sortOrder: "asc",
  },
},
      careerpaths: {
        include: {
          module: true,
          path: true,
        },
      },

      entranceexams: true,
    },
  });
},

  // 🔥 DETAILS BY SECOND CATEGORY (MID LEVEL)
getDetailsBySecond(secondcategoryId) {
  return prisma.details.findMany({
    where: {
      secondcategoryId: Number(secondcategoryId),
      subcategoryId: null,
    },

    include: {
      salaryRanges: true,

      stream: true,
      category: true,
      secondcategory: true,

      institutions: true,
      descriptions: {
  orderBy: {
    sortOrder: "asc",
  },
},
      careerpaths: {
        include: {
          module: true,
          path: true,
        },
      },

      entranceexams: true,
    },
  });
},
getModuleAccess(userId) {
  return prisma.moduleAccess.findMany({
    where: {
      userId: Number(userId),
    },
  });
},
};