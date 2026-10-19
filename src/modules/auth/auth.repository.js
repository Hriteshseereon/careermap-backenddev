
import prisma from '../../config/db.js';

const AuthRepository = {
  async findByMobile(mobile) {
  return prisma.users.findFirst({
    where: { mobile }
  });
},

}

export { AuthRepository };
