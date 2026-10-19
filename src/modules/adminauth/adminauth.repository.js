import prisma from '../../config/db.js';



export const AdminAuthRepository = {
  findByEmail(email) {
    return prisma.adminUsers.findUnique({
      where: { email },
    });

  },

  createAdmin(data) {
    return prisma.adminUsers.create({
      data,
    });
  },
  findById(id) {
  return prisma.adminUsers.findUnique({
    where: { id }
  });
},
// Only for credential checks (login / change password). Never return the result to a client.
findByEmailWithPassword(email) {
  return prisma.adminUsers.findUnique({
    where: { email },
    omit: { password: false },
  });
},
findByIdWithPassword(id) {
  return prisma.adminUsers.findUnique({
    where: { id },
    omit: { password: false },
  });
},
countAdmins() {
  return prisma.adminUsers.count();
},
findSession(refreshToken) {
  return prisma.adminSession.findUnique({
    where: { refreshToken },
  });
},
incrementLoginAttempts(id) {
  return prisma.adminUsers.update({
    where: { id },
    data: {
      loginAttempts: {
        increment: 1,
      },
    },
  });
},

lockAccount(id) {
  const twentyMinutesLater = new Date(
    Date.now() + 60 * 60 * 1000
  );

  return prisma.adminUsers.update({
    where: { id },
    data: {
      loginAttempts: 0,
      lockedUntil: twentyMinutesLater,
    },
  });
},

resetLoginAttempts(id) {
  return prisma.adminUsers.update({
    where: { id },
    data: {
      loginAttempts: 0,
      lockedUntil: null,
    },
  });
},
getActiveSessions(adminId) {
  return prisma.adminSession.count({
    where: {
      adminId,
      isActive: true,
      // Refresh tokens live 7 days; older sessions are dead and must not count
      // towards the device limit (they were never cleaned up, which could lock the admin out).
      createdAt: {
        gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });
},

createSession(data) {
  return prisma.adminSession.create({
    data,
  });
},

deactivateSession(refreshToken) {
  return prisma.adminSession.updateMany({
    where: {
      refreshToken,
    },
    data: {
      isActive: false,
    },
  });
},
findByResetToken(token) {
  return prisma.adminUsers.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });
},
saveResetToken(id, token, expiry) {
  return prisma.adminUsers.update({
    where: { id },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });
},
// Also clears any pending reset token, so a reset link works only once.
updatePassword(id, password) {
  return prisma.adminUsers.update({
    where: { id },
    data: {
      password,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
},
};
