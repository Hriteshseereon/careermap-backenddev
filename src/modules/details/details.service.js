import { detailsRepository } from "./details.repository.js";
import { uploadToS3 } from "../../lib/s3Upload.js"
export const createDetails = async (body, file) => {
  try {
    // Upload media to S3
    let media = null;

    if (file) {
      media = await uploadToS3(file, "details/media");
    }

    // Parse multipart/form-data JSON fields
    const salaryRanges = body.salaryRanges
      ? JSON.parse(body.salaryRanges)
      : [];

    const jobScope = body.jobScope
      ? JSON.parse(body.jobScope)
      : [];

    const careerpathIds = body.careerpathIds
      ? JSON.parse(body.careerpathIds)
      : [];
const descriptionSections = body.descriptionSections
  ? JSON.parse(body.descriptionSections)
  : [];
    const entranceexamIds = body.entranceexamIds
      ? JSON.parse(body.entranceexamIds)
      : [];

    const institutionIds = body.institutionIds
      ? JSON.parse(body.institutionIds)
      : [];

    const {
      specialization,
      important_factor,
      description,
      streamId,
      categoryId,
      secondcategoryId,
      subcategoryId,
      ...rest
    } = body;

    // Check duplicate
    const existing = await detailsRepository.findExisting({
      streamId: Number(streamId),
      categoryId: Number(categoryId),
      secondcategoryId: Number(secondcategoryId),
      subcategoryId: Number(subcategoryId),
    });

    if (existing) {
      return {
        success: false,
        message:
          "Details already exist for this stream/category/secondcategory/subcategory combination",
      };
    }

    const data = {
      ...rest,

      streamId: Number(streamId),
      categoryId: Number(categoryId),
      secondcategoryId: Number(secondcategoryId),
      subcategoryId: Number(subcategoryId),

      description,
      
      specialization,
      important_factor,
      media,

      jobScope,
descriptions: {
  create: descriptionSections.map((item, index) => ({
    title: item.title,
    description: item.description,
    sortOrder: item.sortOrder ?? index,
  })),
},
      salaryRanges: {
        create: salaryRanges,
      },

      ...(careerpathIds.length > 0 && {
        careerpaths: {
          connect: careerpathIds.map((id) => ({
            id: Number(id),
          })),
        },
      }),

      ...(entranceexamIds.length > 0 && {
        entranceexams: {
          connect: entranceexamIds.map((id) => ({
            id: Number(id),
          })),
        },
      }),

      ...(institutionIds.length > 0 && {
        institutions: {
          connect: institutionIds.map((id) => ({
            id: Number(id),
          })),
        },
      }),
    };

    const result = await detailsRepository.create(data);

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.error("Create Details Error:", err);

    return {
      success: false,
      message: err.message,
    };
  }
};
export const getAllDetails = async () => {
  try {
    const data = await detailsRepository.findAll();

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const getDetailsById = async (id) => {
  try {
    const data = await detailsRepository.findById(Number(id));

    if (!data) {
      return {
        success: false,
        message: "Details not found",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const updateDetails = async (id, body, file) => {
  try {
    // Upload media if a new file is provided
    let media;

    if (file) {
      media = await uploadToS3(file, "details/media");
    }

    // Parse multipart/form-data JSON fields
    const salaryRanges = body.salaryRanges
      ? JSON.parse(body.salaryRanges)
      : undefined;

    const jobScope = body.jobScope
      ? JSON.parse(body.jobScope)
      : undefined;

    const careerpathIds = body.careerpathIds
      ? JSON.parse(body.careerpathIds)
      : undefined;

    const entranceexamIds = body.entranceexamIds
      ? JSON.parse(body.entranceexamIds)
      : undefined;

    const institutionIds = body.institutionIds
      ? JSON.parse(body.institutionIds)
      : undefined;
const descriptionSections = body.descriptionSections
  ? JSON.parse(body.descriptionSections)
  : undefined;
    const {
      specialization,
      important_factor,
      description,
      streamId,
      categoryId,
      secondcategoryId,
      subcategoryId,
      ...rest
    } = body;

    // Check duplicate except current record
    const existing = await detailsRepository.findExisting({
      streamId: Number(streamId),
      categoryId: Number(categoryId),
      secondcategoryId: Number(secondcategoryId),
      subcategoryId: Number(subcategoryId),
    });

    if (existing && existing.id !== Number(id)) {
      return {
        success: false,
        message:
          "Details already exist for this stream/category/secondcategory/subcategory combination",
      };
    }

    const data = {
      ...rest,

      streamId: Number(streamId),
      categoryId: Number(categoryId),
      secondcategoryId: Number(secondcategoryId),
      subcategoryId: Number(subcategoryId),

      ...(description !== undefined && {
        description,
      }),

      ...(specialization !== undefined && {
        specialization,
      }),

      ...(important_factor !== undefined && {
        important_factor,
      }),

      ...(media && {
        media,
      }),

      ...(jobScope !== undefined && {
        jobScope,
      }),

      ...(salaryRanges && {
        salaryRanges,
      }),
...(descriptionSections !== undefined && {
  descriptions: descriptionSections,
}),
      ...(careerpathIds && {
        careerpaths: {
          set: careerpathIds.map((id) => ({
            id: Number(id),
          })),
        },
      }),

      ...(entranceexamIds && {
        entranceexams: {
          set: entranceexamIds.map((id) => ({
            id: Number(id),
          })),
        },
      }),

      ...(institutionIds && {
        institutions: {
          set: institutionIds.map((id) => ({
            id: Number(id),
          })),
        },
      }),
    };

    const result = await detailsRepository.update(Number(id), data);

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.error("Update Details Error:", err);

    return {
      success: false,
      message: err.message,
    };
  }
};
export const deleteDetails = async (id) => {
  try {
    await detailsRepository.delete(Number(id));

    return {
      success: true,
      message: "Deleted successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};