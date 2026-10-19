import { MasterClassRepository } from "./masterclass.repository.js";
import { getMasterClassPreviewFlags,resolveContentAccess, } from "../moduleAccess/moduleAccess.service.js";
import {
  PREVIEW_PAGE_TYPES,
} from "../../constants/previewAccess.js";
import { uploadToS3 } from "../../lib/s3Upload.js";
const getPreviewSessionId = (req) =>
  req?.headers?.["x-preview-session"] ||
  req?.query?.previewSessionId ||
  req?.body?.previewSessionId;

const getModuleId = (req) =>
  req?.headers?.["x-module-id"] ||
  req?.query?.moduleId ||
  req?.body?.moduleId;
// 🔹 CREATE
export const createMasterClass = async (body, file) => {
  try {
    let image = body.image || null;

    if (file) {
      image = await uploadToS3(file, "master-class");
    }

    const data = await MasterClassRepository.create({
      category: body.category,
      image,
      title: body.title,
      name: body.name,

      time: body.time
        ? new Date(body.time)
        : null,

      is_free:
        body.is_free === "true" ||
        body.is_free === true,

      views: body.views,

      is_active:
        body.is_active === "true" ||
        body.is_active === true,

      video_url: body.video_url,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔹 GET ALL
export const getMasterClasses = async ( userId,
  moduleId) => {
  try {
  const data = await MasterClassRepository.findAll();

  // Admin call ya x-module-id nahi aaya
  if (!userId || !moduleId) {
    return {
      success: true,
      data,
    };
  }

  const classes = await getMasterClassPreviewFlags(
    userId,
    moduleId,
    data
  );

  return {
    success: true,
    data: classes,
  };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 GET BY ID
export const getMasterClassById = async (id, req) => {
  try {
    const data = await MasterClassRepository.findById(Number(id));

    if (!data) {
      return {
        success: false,
        message: "MasterClass not found",
      };
    }

    const moduleId = getModuleId(req);
    const previewSessionId = getPreviewSessionId(req);
    const userId = req?.user?.id;

    // Admin / normal fetch (preview check nahi)
    if (!moduleId) {
      return {
        success: true,
        data: {
          ...data,
          previewEligible: Boolean(data.is_free),
          accessTier: data.is_free ? "preview" : "locked",
        },
      };
    }

    const access = await resolveContentAccess(userId, {
      moduleId: Number(moduleId),
      pageType: PREVIEW_PAGE_TYPES.MASTERCLASS,
      pageId: Number(id),
      previewSessionId,
    });

    if (!access.allowed) {
      return {
        success: false,
        message: access.message,
        access: {
          mode: access.mode,
          allowed: false,
          remainingSeconds: access.remainingSeconds ?? null,
          expiresAt: access.expiresAt ?? null,
          previewDurationSeconds:
            access.previewDurationSeconds ?? null,
          message: access.message,
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
        allowed: true,
        remainingSeconds: access.remainingSeconds ?? null,
        expiresAt: access.expiresAt ?? null,
        previewDurationSeconds:
          access.previewDurationSeconds ?? null,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
// 🔹 UPDATE
export const updateMasterClass = async (
  id,
  body,
  file
) => {
  try {
    let image;

    if (file) {
      image = await uploadToS3(
        file,
        "master-class"
      );
    }

    const updated =
      await MasterClassRepository.update(
        Number(id),
        {
          category: body.category,
          ...(image && { image }),

          title: body.title,
          name: body.name,

          time:
            body.time !== undefined
              ? body.time
                ? new Date(body.time)
                : null
              : undefined,

          views: body.views,

          is_active:
            body.is_active !== undefined
              ? body.is_active === "true" ||
                body.is_active === true
              : undefined,

          is_free:
            body.is_free !== undefined
              ? body.is_free === "true" ||
                body.is_free === true
              : undefined,

          video_url: body.video_url,
        }
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

// 🔹 DELETE
export const deleteMasterClass = async (id) => {
  try {
    await MasterClassRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateMasterClassFreeStatus = async (
  id,
  is_free
) => {
  try {
    const data =
      await MasterClassRepository.updateFreeStatus(
        id,
        is_free
      );

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};