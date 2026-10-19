import prisma from "../../config/db.js";

export const detailsRepository = {

create: (data) => {
  return prisma.details.create({
    data: {
      jobScope: data.jobScope,
        media: data.media,
        specialization: data.specialization,
  important_factor: data.important_factor,
      description: data.description,

      ...(data.descriptions && {
  descriptions: data.descriptions,
}),
      // Single relations
      ...(data.streamId && {
        stream: {
          connect: { id: data.streamId }
        }
      }),

      ...(data.categoryId && {
        category: {
          connect: { id: data.categoryId }
        }
      }),

      ...(data.secondcategoryId && {
        secondcategory: {
          connect: { id: data.secondcategoryId }
        }
      }),

      ...(data.subcategoryId && {
        subcategory: {
          connect: { id: data.subcategoryId }
        }
      }),

      // Salary ranges
      salaryRanges: data.salaryRanges,

      // ✅ MANY-TO-MANY
     ...(data.careerpaths && {
  careerpaths: data.careerpaths
}),

...(data.entranceexams && {
  entranceexams: data.entranceexams
}),

...(data.institutions && {
  institutions: data.institutions
})
     
    },

    include: {
      salaryRanges: true,
      stream: true,
      category: true,
      secondcategory: true,
      subcategory: true,
       descriptions: true,
      // ✅ INCLUDE THESE
      careerpaths: true,
      entranceexams: true,
      institutions: true
    }
  });
},

  findAll: () => {
    return prisma.details.findMany({
      include: {
        salaryRanges: true,
        stream: true,
        category: true,
        secondcategory: true,
        subcategory: true,
         careerpaths: true,
          descriptions: true,
      entranceexams: true,
      institutions: true
      }
    });
  },

  findById: (id) => {
    return prisma.details.findUnique({
      where: { id },
      include: {
        salaryRanges: true,
        stream: true,
        category: true,
        secondcategory: true,
        subcategory: true,
         careerpaths: true,
          descriptions: true,
      entranceexams: true,
      institutions: true
      }
    });
  },

update: (id, data) => {
  return prisma.details.update({
    where: { id },

    data: {

      ...(data.jobScope !== undefined && {
        jobScope: data.jobScope
      }),
      ...(data.media !== undefined && {
  media: data.media,
}),
      ...(data.specialization !== undefined && {
  specialization: data.specialization
}),

...(data.important_factor !== undefined && {
  important_factor: data.important_factor
}),
        ...(data.description !== undefined && {
    description: data.description
  }),

  ...(data.descriptions && {
  descriptions: {
    deleteMany: {},
    create: data.descriptions,
  },
}),
      ...(data.streamId && {
        stream: {
          connect: { id: data.streamId }
        }
      }),

      ...(data.categoryId && {
        category: {
          connect: { id: data.categoryId }
        }
      }),

      ...(data.secondcategoryId && {
        secondcategory: {
          connect: { id: data.secondcategoryId }
        }
      }),

      ...(data.subcategoryId && {
        subcategory: {
          connect: { id: data.subcategoryId }
        }
      }),

      ...(data.salaryRanges && {
        salaryRanges: {
          deleteMany: {},
          create: data.salaryRanges
        }
      }),

      ...(data.careerpaths && {
  careerpaths: data.careerpaths,
}),

...(data.entranceexams && {
  entranceexams: data.entranceexams,
}),

...(data.institutions && {
  institutions: data.institutions,
}),
    },

    include: {
      salaryRanges: true,
      careerpaths: true,
      entranceexams: true,
      institutions: true
    }
  });
},

  delete: (id) => {
    return prisma.details.delete({
      where: { id }
    });
  },
  findExisting: (data) => {
  return prisma.details.findFirst({
    where: {
      streamId: data.streamId,
      categoryId: data.categoryId,
      secondcategoryId: data.secondcategoryId,
      subcategoryId: data.subcategoryId,
    },
  });
},
};