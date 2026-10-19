import prisma from '../../config/db.js';

const UserRepository = {
  async findByEmail(email) {
    return prisma.users.findUnique({ where: { email } });
  },
   async findById(id) {
    return prisma.users.findUnique({ where: { id } });
  },
  // Only for credential checks (login / change / reset password). Never return the result to a client.
  async findByEmailWithPassword(email) {
    return prisma.users.findUnique({ where: { email }, omit: { password: false } });
  },
  async findByIdWithPassword(id) {
    return prisma.users.findUnique({ where: { id }, omit: { password: false } });
  },
async findByMobile(mobile) {
  return prisma.users.findFirst({
    where: { mobile }
  });
},
async updateUser(id, data) {
  return prisma.users.update({
    where: { id },
    data,
  });
},
async updatePassword(id, password) {
  return prisma.users.update({
    where: { id },
    data: {
      password,
    },
  });
},
  async createUserWithLandingData(userData, landingData) {
    // landingData is optional: without it the user is created without an onboarding profile
    // (same as institute-created students) instead of crashing.
    if (!landingData || typeof landingData !== "object") {
      return prisma.users.create({
        data: { ...userData },
        include: { profile: true },
      });
    }
    return prisma.users.create({
      data: {
        ...userData,

        profile: {
          create: {
            class: landingData.class,
            stream: landingData.stream,
            interest: landingData.interest,
            clarity: landingData.clarity,
            strength: landingData.strength,
            priority: landingData.priority
          }
        }
      },
      include: {
         profile: true
      }
    });
  },

  // get all user list with pagination
  getAllUsers() {
  return prisma.users.findMany({
    include: {
      profile: true,
      subscription: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
},
getUserById(id) {
  return prisma.users.findUnique({
    where: {
      id,
    },

    include: {
      profile: true,
      subscription: true,
      payments: true,
      userloginhistory: true,
    },
  });
},

banUser(id) {
  return prisma.users.update({
    where: { id },
    data: {
      status: "banned",
    },
  });
},
unbanUser(id) {
  return prisma.users.update({
    where: { id },
    data: {
      status: "active",
    },
  });
},

getBannedUsers() {
  return prisma.users.findMany({
    where: {
      status: "banned",
    },
     include: {
      profile: true,
    },
  });
},
getUserTransactions(userId) {
  return prisma.payment.findMany({
    where: {
      userId,
    },

    include: {
      plan: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
},
async getLoginHistory(userId) {
  return prisma.userLoginHistory.findMany({
    where: {
      userId,
    },

    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },

    orderBy: {
      loginAt: "desc",
    },
  });
}
}

export { UserRepository };