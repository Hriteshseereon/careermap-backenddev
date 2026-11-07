import prisma from "../../config/db.js";
import { canonicalState } from "../../utils/stateNormalizer.js";

const STATE_VARIANTS_TTL_MS = 10 * 60 * 1000;
let stateVariantsCache = { at: 0, byState: new Map() };

// Raw spellings stored in Institutions.state, grouped by canonical state name
// ("Odisha" -> ["Odisha", "ODISHA", "Orissa", "Bhubaneswar", ...]).
const getStateVariantMap = async () => {
  if (Date.now() - stateVariantsCache.at < STATE_VARIANTS_TTL_MS) {
    return stateVariantsCache.byState;
  }

  const rows = await prisma.institutions.groupBy({ by: ["state"] });
  const byState = new Map();
  for (const { state } of rows) {
    const canonical = canonicalState(state);
    if (!canonical) continue;
    if (!byState.has(canonical)) byState.set(canonical, []);
    byState.get(canonical).push(state);
  }

  stateVariantsCache = { at: Date.now(), byState };
  return byState;
};

const getRawStateVariants = async (state) => {
  const canonical = canonicalState(state);
  if (!canonical) return [];
  return (await getStateVariantMap()).get(canonical) || [];
};

const buildWhere = async (options, { skipState = false } = {}) => {
  const {
    streamId,
    categoryId,
    secondcategoryId,
    subcategoryId,
    country = "",
    state = "",
    excludeState = "",
    city = "",
    district = "",
    type = "",
    is_top,
    search = "",
  } = options;

  const where = {};
  const and = [];

  // 1. Hierarchy filters:
  // Subcategory (deepest level)
  if (
    subcategoryId !== undefined &&
    subcategoryId !== null &&
    String(subcategoryId).trim() !== "" &&
    String(subcategoryId).trim().toLowerCase() !== "all"
  ) {
    const val = String(subcategoryId).trim();
    if (/^\d+$/.test(val)) {
      where.subcategoryId = Number(val);
    } else {
      where.subcategory = {
        title: { equals: val, mode: "insensitive" },
      };
    }
  }

  // Secondary Category (mid level)
  if (
    secondcategoryId !== undefined &&
    secondcategoryId !== null &&
    String(secondcategoryId).trim() !== "" &&
    String(secondcategoryId).trim().toLowerCase() !== "all"
  ) {
    const val = String(secondcategoryId).trim();
    if (/^\d+$/.test(val)) {
      where.secondcategoryId = Number(val);
    } else {
      where.secondcategory = {
        name: { equals: val, mode: "insensitive" },
      };
    }
  }

  // Category (primary level)
  if (
    categoryId !== undefined &&
    categoryId !== null &&
    String(categoryId).trim() !== "" &&
    String(categoryId).trim().toLowerCase() !== "all"
  ) {
    const val = String(categoryId).trim();
    if (/^\d+$/.test(val)) {
      where.categoryId = Number(val);
    } else {
      where.category = {
        title: { equals: val, mode: "insensitive" },
      };
    }
  }

  // Stream (top level)
  if (
    streamId !== undefined &&
    streamId !== null &&
    String(streamId).trim() !== "" &&
    String(streamId).trim().toLowerCase() !== "all"
  ) {
    const val = String(streamId).trim();
    if (/^\d+$/.test(val)) {
      where.category = {
        ...(where.category || {}),
        streamId: Number(val),
      };
    } else {
      where.category = {
        ...(where.category || {}),
        stream: {
          name: { equals: val, mode: "insensitive" },
        },
      };
    }
  }

  // 2. Search / Query filter
  if (search && String(search).trim()) {
    const term = String(search).trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { city: { contains: term, mode: "insensitive" } },
      { state: { contains: term, mode: "insensitive" } },
      { district: { contains: term, mode: "insensitive" } },
    ];
  }

  // 3. Location filters
  if (country && String(country).trim().toLowerCase() !== "all") {
    where.countruy = {
      equals: String(country).trim(),
      mode: "insensitive",
    };
  }
  if (!skipState && state && String(state).trim().toLowerCase() !== "all") {
    const variants = await getRawStateVariants(state);
    if (variants.length > 0) {
      and.push({ state: { in: variants } });
    } else {
      and.push({
        state: { equals: String(state).trim(), mode: "insensitive" },
      });
    }
  }

  // Everything except one state (e.g. "outside Odisha"); rows without a
  // state (Pan India / online) count as outside.
  if (!skipState && excludeState && String(excludeState).trim()) {
    const variants = await getRawStateVariants(excludeState);
    if (variants.length > 0) {
      and.push({ OR: [{ state: null }, { state: { notIn: variants } }] });
    }
  }
  if (city && String(city).trim().toLowerCase() !== "all") {
    where.city = {
      equals: String(city).trim(),
      mode: "insensitive",
    };
  }
  if (district && String(district).trim().toLowerCase() !== "all") {
    where.district = {
      equals: String(district).trim(),
      mode: "insensitive",
    };
  }

  // 4. Institute type (Govt / Pvt)
  if (type && String(type).trim().toLowerCase() !== "all") {
    const rawType = String(type).trim().toLowerCase();
    if (rawType === "govt" || rawType === "government") {
      where.institute_type = {
        in: ["Govt", "Government", "Govt."],
        mode: "insensitive",
      };
    } else if (rawType === "pvt" || rawType === "private") {
      where.institute_type = {
        in: ["Pvt", "Private", "Pvt."],
        mode: "insensitive",
      };
    } else {
      where.institute_type = {
        equals: String(type).trim(),
        mode: "insensitive",
      };
    }
  }

  // 5. is_top flag
  if (is_top !== undefined && is_top !== null && String(is_top).trim() !== "") {
    where.is_top = is_top === "true" || is_top === true;
  }


  if (and.length > 0) where.AND = and;

  return where;
};


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

  // Institute counts per canonical state for the current hierarchy / type /
  // search filters. The state filters themselves are ignored so the dropdown
  // always lists every state that has data.
  async getStateFacets(options = {}) {
    const where = await buildWhere(options, { skipState: true });
    const rows = await prisma.institutions.groupBy({
      by: ["state"],
      where,
      _count: { _all: true },
    });

    const states = new Map();
    let unassigned = 0;
    for (const row of rows) {
      const canonical = canonicalState(row.state);
      if (!canonical) {
        unassigned += row._count._all;
        continue;
      }
      states.set(canonical, (states.get(canonical) || 0) + row._count._all);
    }

    return {
      states: [...states.entries()]
        .map(([state, count]) => ({ state, count }))
        .sort((a, b) => a.state.localeCompare(b.state)),
      unassigned,
    };
  },

  async findPaginated(optionsOrPage = 1, legacyLimit = 20, ...legacyArgs) {
    let options = {};
    if (typeof optionsOrPage === "object" && optionsOrPage !== null) {
      options = optionsOrPage;
    } else {
      const [country = "", state = "", type = "", category = ""] = legacyArgs;
      options = {
        page: optionsOrPage,
        limit: legacyLimit,
        country,
        state,
        type,
        categoryId: category,
      };
    }

    const {
      page = 1,
      limit = 20,
      streamId,
      categoryId,
      secondcategoryId,
      subcategoryId,
      country = "",
      state = "",
      city = "",
      district = "",
      type = "",
      is_top,
      search = "",
      sortBy = "is_top",
      sortOrder = "desc",
    } = options;

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const where = await buildWhere(options);

    // 6. Sorting
    let orderBy = [{ is_top: "desc" }, { name: "asc" }];
    if (sortBy === "name") {
      orderBy = [{ name: sortOrder === "desc" ? "desc" : "asc" }];
    } else if (sortBy === "createdAt") {
      orderBy = [{ createdAt: sortOrder === "desc" ? "desc" : "asc" }];
    } else if (sortBy === "is_top") {
      orderBy = [{ is_top: sortOrder === "asc" ? "asc" : "desc" }, { name: "asc" }];
    }

    const [data, total] = await Promise.all([
      prisma.institutions.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          category: {
            select: {
              id: true,
              title: true,
              streamId: true,
              stream: {
                select: { id: true, name: true },
              },
            },
          },
          secondcategory: {
            select: { id: true, name: true },
          },
          subcategory: {
            select: { id: true, title: true },
          },
        },
        orderBy,
      }),
      prisma.institutions.count({ where }),
    ]);

    return {
      data,
      total,
      page: pageNum,
      limit: limitNum,
    };
  },
};

export { InstitutionRepository };
