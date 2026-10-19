import prisma from "../../config/db.js";

export const ModuleAccessRepository = {
  findAccess(userId, moduleId) {
    return prisma.moduleAccess.findUnique({
      where: {
        userId_moduleId: {
          userId: Number(userId),
          moduleId: Number(moduleId),
        },
      },
    });
  },

  createAccess(userId, moduleId) {
    return prisma.moduleAccess.create({
      data: {
        userId: Number(userId),
        moduleId: Number(moduleId),
        freeVisitUsed: true,
      },
    });
  },

  createPreviewSession({ userId, moduleId, pageType, pageId, expiresAt }) {
    return prisma.previewSession.create({
      data: {
        userId: Number(userId),
        moduleId: Number(moduleId),
        pageType,
        pageId: Number(pageId),
        expiresAt,
      },
    });
  },

  findPreviewSessionById(sessionId) {
    return prisma.previewSession.findUnique({
      where: { id: Number(sessionId) },
    });
  },

  deleteExpiredSessions(before = new Date()) {
    return prisma.previewSession.deleteMany({
      where: {
        expiresAt: {
          lt: before,
        },
      },
    });
  },
};
