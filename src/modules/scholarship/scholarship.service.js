import { uploadToS3 } from "../../lib/s3Upload.js";
import { ScholarshipRepository } from "./scholarship.repository.js";
import {
  getScholarshipPreviewFlags,
  resolveContentAccess,
} from "../moduleAccess/moduleAccess.service.js";
import { PREVIEW_PAGE_TYPES } from "../../constants/previewAccess.js";

const getPreviewSessionId = (req) =>
  req?.headers?.["x-preview-session"] ||
  req?.query?.previewSessionId ||
  req?.body?.previewSessionId;

const getModuleId = (req) =>
  req?.headers?.["x-module-id"] ||
  req?.query?.moduleId ||
  req?.body?.moduleId;

// 🔹 CREATE
export const createScholarship = async (body, file) => {
  try {
    // ✅ unique name check
    const existing = await ScholarshipRepository.findByName(body.name);

    if (existing) {
      return {
        success: false,
        message: "Scholarship with this name already exists",
      };
    }

    let imageUrl;
    if (file) {
      imageUrl = await uploadToS3(file, "scholarships");
    }
    let sections = [];
    if (body.sections) {
  sections = JSON.parse(body.sections);
    sections = sections.map((section, index) => ({
    title: section.title,
    description: section.description,
    sortOrder: index,
  }));
}
    const data = await ScholarshipRepository.create({
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
      type: body.type,
      url: body.url,
      is_free:
        body.is_free !== undefined
          ? body.is_free === "true" || body.is_free === true
          : undefined,
      price: body.price,
      deadline: body.deadline ? new Date(body.deadline) : null,
      eligibility: body.eligibility,
      requirement: body.requirement,
      description: body.description,

      ...(imageUrl && { image: imageUrl }),
     sections: {
    create: sections,
  },
    });

    return { success: true, data };
  } catch (error) {
    console.error("❌ createScholarship Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 GET ALL
export const getScholarships = async () => {
  try {
    const data = await ScholarshipRepository.findAll();
    const scholarships = await getScholarshipPreviewFlags(data);

    return {
      success: true,
      data: scholarships,
      previewDurationSeconds: 15,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 GET BY ID
export const getScholarshipById = async (id, req) => {
  try {
    const data = await ScholarshipRepository.findById(Number(id));

    if (!data) {
      return { success: false, message: "Not found" };
    }

    const moduleId = getModuleId(req);
    const previewSessionId = getPreviewSessionId(req);
    const userId = req?.user?.id;

    if (!moduleId) {
      return {
        success: true,
        data: {
          ...data,
          previewEligible: Boolean(data.is_free),
          accessTier: data.is_free ? "preview" : "locked",
        },
        previewDurationSeconds: 15,
      };
    }

    const access = await resolveContentAccess(userId, {
      moduleId,
      pageType: PREVIEW_PAGE_TYPES.SCHOLARSHIP,
      pageId: id,
      previewSessionId,
    });

    if (!access.allowed) {
      return {
        success: false,
        message: access.message,
        access: {
          mode: access.mode,
          allowed: access.allowed,
          remainingSeconds: access.remainingSeconds ?? null,
          expiresAt: access.expiresAt ?? null,
          previewDurationSeconds: access.previewDurationSeconds ?? null,
          message: access.message ?? null,
        },
      };
    }

    return {
      success: true,
      data: {
        ...data,
        previewEligible: Boolean(data.is_free),
        accessTier: data.is_free ? "preview" : "locked",
      },
      access: {
        mode: access.mode,
        allowed: access.allowed,
        remainingSeconds: access.remainingSeconds ?? null,
        expiresAt: access.expiresAt ?? null,
        previewDurationSeconds: access.previewDurationSeconds ?? null,
      },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 UPDATE
export const updateScholarship = async (id, body, file) => {
  try {
    let imageUrl;

    if (file) {
      imageUrl = await uploadToS3(file, "scholarships");
    }
    let sections = [];

if (body.sections) {
  sections = JSON.parse(body.sections);

    sections = sections.map((section, index) => ({
    title: section.title,
    description: section.description,
    sortOrder: index,
  }));
}
    const updated = await ScholarshipRepository.update(Number(id), {
    categoryId:
  body.categoryId !== undefined
    ? body.categoryId === ""
      ? null
      : Number(body.categoryId)
    : undefined,

secondcategoryId:
  body.secondcategoryId !== undefined
    ? body.secondcategoryId === ""
      ? null
      : Number(body.secondcategoryId)
    : undefined,

subcategoryId:
  body.subcategoryId !== undefined
    ? body.subcategoryId === ""
      ? null
      : Number(body.subcategoryId)
    : undefined,
      name: body.name,
      type: body.type,
      url: body.url,
      is_free:
        body.is_free !== undefined
          ? body.is_free === "true" || body.is_free === true
          : undefined,
      price: body.price,
      deadline: body.deadline ? new Date(body.deadline) : null,
      eligibility: body.eligibility,
      requirement: body.requirement,
      description: body.description,

      ...(imageUrl && { image: imageUrl }),
   
  sections: {
    deleteMany: {},     // Purane sections delete
    create: sections,   // Naye sections add
  },
    });

    return { success: true, data: updated };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 DELETE
export const deleteScholarship = async (id) => {
  try {
    await ScholarshipRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const updateScholarshipFreeStatus = async (
  id,
  is_free
) => {
  try {
    const updated =
      await ScholarshipRepository.updateFreeStatus(
        id,
        is_free
      );

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};