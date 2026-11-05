import prisma from "../../../config/db.js";

const careerPathInclude = {
  module: true,
  path: true,
};

async function attachResolvedCareerPaths(detailsList) {
  if (!detailsList || detailsList.length === 0) return detailsList;

  return Promise.all(
    detailsList.map(async (detail) => {
      // 1. If detail has a subcategoryId, look for career paths specifically assigned to this subcategory
      if (detail.subcategoryId) {
        const subPaths = await prisma.careerPath.findMany({
          where: { subcategoryId: Number(detail.subcategoryId) },
          include: careerPathInclude,
        });
        if (subPaths.length > 0) {
          return { ...detail, careerpaths: subPaths };
        }
      }

      // 2. If detail has a secondcategoryId, look for career paths specifically assigned to this secondcategory
      if (detail.secondcategoryId) {
        const secPaths = await prisma.careerPath.findMany({
          where: { secondcategoryId: Number(detail.secondcategoryId) },
          include: careerPathInclude,
        });
        if (secPaths.length > 0) {
          return { ...detail, careerpaths: secPaths };
        }
      }

      // 3. If detail has a categoryId, look for career paths specifically assigned to this category
      if (detail.categoryId) {
        const catPaths = await prisma.careerPath.findMany({
          where: {
            categoryId: Number(detail.categoryId),
            secondcategoryId: null,
            subcategoryId: null,
          },
          include: careerPathInclude,
        });
        if (catPaths.length > 0) {
          return { ...detail, careerpaths: catPaths };
        }
      }

      // 4. Fallback: filter existing joined career paths so that unassigned or mismatched
      // career paths never leak into an unrelated category.
      const validJoinedPaths = (detail.careerpaths || []).filter((cp) => {
        if (cp.categoryId && detail.categoryId && cp.categoryId !== detail.categoryId) {
          return false;
        }
        if (cp.secondcategoryId && detail.secondcategoryId && cp.secondcategoryId !== detail.secondcategoryId) {
          return false;
        }
        if (cp.subcategoryId && detail.subcategoryId && cp.subcategoryId !== detail.subcategoryId) {
          return false;
        }
        // If career path has no category set, do not leak it into a categorized detail
        if (!cp.categoryId && detail.categoryId) {
          return false;
        }
        return true;
      });

      return { ...detail, careerpaths: validJoinedPaths };
    })
  );
}

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
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
  },

  // 🔹 SECOND CATEGORY
  getSecondCategories(categoryId) {
    return prisma.secondcategory.findMany({
      where: { categoryId: Number(categoryId) },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
  },

  // 🔹 SUB CATEGORY
  getSubCategories(secondcategoryId) {
    return prisma.subcategory.findMany({
      where: { secondcategoryId: Number(secondcategoryId) },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
  },

  // 🔥 DETAILS BY SUBCATEGORY (DEEP LEVEL)
  async getDetailsBySubCategory(subcategoryId) {
    const list = await prisma.details.findMany({
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

    return attachResolvedCareerPaths(list);
  },

  // 🔥 DETAILS BY CATEGORY (DIRECT LEVEL)
  async getDetailsByCategory(categoryId) {
    const list = await prisma.details.findMany({
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

    return attachResolvedCareerPaths(list);
  },

  // 🔥 DETAILS BY SECOND CATEGORY (MID LEVEL)
  async getDetailsBySecond(secondcategoryId) {
    const list = await prisma.details.findMany({
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

    return attachResolvedCareerPaths(list);
  },
getModuleAccess(userId) {
  return prisma.moduleAccess.findMany({
    where: {
      userId: Number(userId),
    },
  });
},
};
