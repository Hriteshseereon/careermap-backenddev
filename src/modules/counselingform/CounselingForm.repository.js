import prisma from "../../config/db.js";

export const CounselingRepository = {
  async create(data) {
    try {
      return await prisma.counselingForm.create({
        data,
      });
    } catch (err) {
      if (data.totalPercentage !== undefined && err.message && err.message.includes("totalPercentage")) {
        const { totalPercentage, ...rest } = data;
        return await prisma.counselingForm.create({
          data: rest,
        });
      }
      throw err;
    }
  },

  findAll(where = {}) {
    return prisma.counselingForm.findMany({
      where,
      include: {
        schoolInstitution: { select: { id: true, name: true, city: true, state: true } },
        institute: { select: { id: true, name: true, email: true, mobile: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id) {
    return prisma.counselingForm.findUnique({
      where: { id },
      include: {
        schoolInstitution: { select: { id: true, name: true, city: true, state: true } },
        institute: { select: { id: true, name: true, email: true, mobile: true } },
      },
    });
  },

  async update(id, data) {
    try {
      return await prisma.counselingForm.update({
        where: { id },
        data,
      });
    } catch (err) {
      if (data.totalPercentage !== undefined && err.message && err.message.includes("totalPercentage")) {
        const { totalPercentage, ...rest } = data;
        return await prisma.counselingForm.update({
          where: { id },
          data: rest,
        });
      }
      throw err;
    }
  },

  delete(id) {
    return prisma.counselingForm.delete({
      where: { id },
    });
  },
};
