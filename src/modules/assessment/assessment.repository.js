// assessment.repository.js

import prisma from "../../config/db.js";

export const AssessmentRepository = {
  createAssessment(data) {
    return prisma.psychometricAssessment.create({
      data,
    });
  },

  getLatestAssessmentByUserId(userId) {
    return prisma.psychometricAssessment.findFirst({
        where:{userId},
        orderBy:{
            createdAt:"desc"
        }
    });
},

  getAssessmentById(id) {
    return prisma.psychometricAssessment.findUnique({
      where: {
        id,
      },
    });
  },

  getAllAssessmentsByUserId(userId) {
    return prisma.psychometricAssessment.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  deleteAssessment(id) {
    return prisma.psychometricAssessment.delete({
      where: {
        id,
      },
    });
  },
};