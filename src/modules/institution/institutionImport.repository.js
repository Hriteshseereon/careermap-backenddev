import prisma from "../../config/db.js";

export const InstitutionImportRepository = {
  create(data) {
    return prisma.institutionImport.create({
      data,
    });
  },

  findById(id) {
    return prisma.institutionImport.findUnique({
      where: {
        id: Number(id),
      },
    });
  },

  update(id, data) {
    return prisma.institutionImport.update({
      where: {
        id: Number(id),
      },
      data,
    });
  },
};