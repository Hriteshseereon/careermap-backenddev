import prisma from "../../config/db.js";

const modulesRepository = {
    async createModule(data){
        return prisma.module.create({data})
    },

    async findAll() {
        return prisma.module.findMany();

    },
    async findById(id){
        return prisma.module.findUnique({where:{id}})
    },
    async update(id,data){
        return prisma.module.update({
            where:{id},
            data,
        })
    },
    async deleteModule(id){
    return prisma.module.delete({
        where: { id }
    });
}
}

export {modulesRepository};