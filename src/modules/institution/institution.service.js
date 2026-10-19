import { uploadToS3 } from "../../lib/s3Upload.js";
import { InstitutionRepository } from "./institution.repository.js";

// 🔹 Create
export const createInstitution = async (body, file) => {
  try {
    const imageUrl = file
      ? await uploadToS3(file, "institutions")
      : null;

    // 🔥 FIX ARRAY PARSING
    let course_offered = [];
    if (body.course_offered) {
      try {
        course_offered = JSON.parse(body.course_offered);
      } catch {
        course_offered = [body.course_offered];
      }
    }

    const institution = await InstitutionRepository.createInstitution({
       categoryId: body.categoryId
        ? Number(body.categoryId)
        : null,

      secondcategoryId:
        body.secondcategoryId
          ? Number(body.secondcategoryId)
          : null,

      subcategoryId:
        body.subcategoryId
          ? Number(body.subcategoryId)
          : null,
      name: body.name,
      logo: imageUrl,
      address: body.address,
      admission_process: body.admission_process,
      tentative_date: body.tentative_date,
      institute_type: body.institute_type,
      url: body.url,
      countruy: body.countruy,
      state: body.state,
      city: body.city,
      district: body.district,

      about: body.about,
      course_offered, // ✅ parsed array

      is_top: body.is_top === "true" || body.is_top === true,
    });

    return { success: true, data: institution };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 Get All
export const getInstitutions = async () => {
  try {
    const data = await InstitutionRepository.findAll();
    return { success: true, data };
  } catch (error) {
    console.error("❌ getInstitutions Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 Get Institutions - Paginated for User Portal
export const getPaginatedInstitutions = async (
  page = 1,
  limit = 30,
  country = "",
  state = "",
  type = "",
  category = ""
) => {
  try {
    page = Math.max(Number(page) || 1, 1);

    limit = Math.min(
      Math.max(Number(limit) || 30, 1),
      100
    );

    const { data, total } =
      await InstitutionRepository.findPaginated(
        page,
        limit,
        country,
        state,
        type,
        category
      );

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error(
      "❌ getPaginatedInstitutions Error:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};
// 🔹 Update
export const updateInstitution = async (id, body, file) => {
  try {
    let logoUrl;

    if (file) {
      logoUrl = await uploadToS3(file, "institutions");
    }

    let course_offered;

    if (body.course_offered !== undefined) {
      try {
        course_offered = JSON.parse(body.course_offered);
      } catch {
        course_offered = [body.course_offered];
      }
    }

    const updated = await InstitutionRepository.update(
      Number(id),
      {
        categoryId: body.categoryId
          ? Number(body.categoryId)
          : null,

        secondcategoryId: body.secondcategoryId
          ? Number(body.secondcategoryId)
          : null,

        subcategoryId: body.subcategoryId
          ? Number(body.subcategoryId)
          : null,

        name: body.name,
        address: body.address,
        admission_process: body.admission_process,
        tentative_date: body.tentative_date,
        institute_type: body.institute_type,
        url: body.url,
        countruy: body.countruy,
        state: body.state,
        city: body.city,
        district: body.district,
        about: body.about,

        ...(course_offered !== undefined && {
          course_offered,
        }),

        is_top:
          body.is_top !== undefined
            ? body.is_top === "true" ||
              body.is_top === true
            : undefined,

        ...(logoUrl && {
          logo: logoUrl,
        }),
      }
    );

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error("Update Institution Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

export const getInstitutionById = async (id) => {
  try {
    const institution = await InstitutionRepository.findById(Number(id));

    if (!institution) {
      return { success: false, message: "Institution not found" };
    }

    return { success: true, data: institution };

  } catch (error) {
    console.error("❌ getInstitutionById Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 Delete
export const deleteInstitution = async (id) => {
  try {
    await InstitutionRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    console.error("❌ deleteInstitution Error:", error);
    return { success: false, message: error.message };
  }
};