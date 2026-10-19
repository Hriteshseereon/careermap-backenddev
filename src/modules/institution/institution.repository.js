import prisma from "../../config/db.js";
const InstitutionRepository = {
  async createInstitution(data) {
    return prisma.institutions.create({ data });
  },

  async findAll() {
  return prisma.institutions.findMany({
    include: {
      category: true,
      secondcategory: true,
      subcategory: true,
    },
  });
},
async findById(id) {
  return prisma.institutions.findUnique({
    where: { id },
    include: {
      category: true,
      secondcategory: true,
      subcategory: true,
    },
  });
},
async update(id, data) {
  try {
    return await prisma.institutions.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Prisma Institution Update Error:", error);
    throw error;
  }
},
  async delete(id) {    
    return prisma.institutions.delete({
      where: { id },
    });
  },
async findPaginated(
  page = 1,
  limit = 30,
  country = "",
  state = "",
  type = "",
  category = ""
) {
  const skip = (page - 1) * limit;

  const where = {};

  if (country && String(country).trim().toLowerCase() !== "all") {
    where.countruy = {
      equals: String(country).trim(),
      mode: "insensitive",
    };
  }

  if (state && String(state).trim().toLowerCase() !== "all") {
    where.state = {
      equals: String(state).trim(),
      mode: "insensitive",
    };
  }

  if (type && String(type).trim().toLowerCase() !== "all") {
    where.institute_type = {
      equals: String(type).trim(),
      mode: "insensitive",
    };
  }

  if (category && String(category).trim().toLowerCase() !== "all") {
    const trimmedCategory = String(category).trim();
    if (/^\d+$/.test(trimmedCategory)) {
      where.categoryId = Number(trimmedCategory);
    } else {
      where.category = {
        title: {
          equals: trimmedCategory,
          mode: "insensitive",
        },
      };
    }
  }

  const [data, total] = await Promise.all([
    prisma.institutions.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
        secondcategory: true,
        subcategory: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.institutions.count({
      where,
    }),
  ]);

  return {
    data,
    total,
  };
},
};

export { InstitutionRepository }; 