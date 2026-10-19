import prisma from "../../config/db.js";

export const careerPathRepository = {
  create: (data) => prisma.careerPath.create({
    data,
    include: { module:true, category:true, secondcategory:true, subcategory:true, path:true }
  }),
  findByPathName: (pathName) => prisma.careerPath.findUnique({
  where: { pathName }
}),
  findAll: () => prisma.careerPath.findMany({
    include: { module:true, category:true, path:true }
  }),

  findById: (id) => prisma.careerPath.findUnique({
    where: { id },
    include: { module:true, path:true }
  }),

  update: (id,data)=> prisma.careerPath.update({
    where:{id},
    data
  }),

  delete: (id)=> prisma.careerPath.delete({ where:{id} })
};