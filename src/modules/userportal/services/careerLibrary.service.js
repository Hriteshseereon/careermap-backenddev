import { UserPortalRepository } from "../repository/userPortal.repository.js";
import {
  getCategoryPreviewFlags,
  resolveContentAccess,
} from "../../moduleAccess/moduleAccess.service.js";
import { PREVIEW_PAGE_TYPES } from "../../../constants/previewAccess.js";

const getPreviewSessionId = (req) =>
  req.headers["x-preview-session"] ||
  req.query.previewSessionId ||
  req.body?.previewSessionId;

const getModuleId = (req) =>
  req.headers["x-module-id"] || req.query.moduleId || req.body?.moduleId;

const buildAccessMeta = (access) => ({
  access: {
    mode: access.mode,
    allowed: access.allowed,
    remainingSeconds: access.remainingSeconds ?? null,
    expiresAt: access.expiresAt ?? null,
    previewDurationSeconds: access.previewDurationSeconds ?? null,
    message: access.message ?? null,
  },
});

const guardContentAccess = async ({
  req,
  pageType,
  pageId,
  data,
  type,
}) => {
  const userId = req.user?.id;
  const moduleId = getModuleId(req);
  const previewSessionId = getPreviewSessionId(req);

  if (!moduleId) {
    return {
      success: true,
      ...(type ? { type } : {}),
      data,
      ...buildAccessMeta({
        allowed: true,
        mode: userId ? "preview_listing" : "public",
      }),
    };
  }

  const access = await resolveContentAccess(userId, {
    moduleId,
    pageType,
    pageId,
    previewSessionId,
  });

  if (!access.allowed) {
    return {
      success: false,
      message: access.message,
      ...buildAccessMeta(access),
    };
  }

  return {
    success: true,
    ...(type ? { type } : {}),
    data,
    ...buildAccessMeta(access),
  };
};

export const getCategories = async () => {
  try {
    const data = await UserPortalRepository.getAllCategories();
    const categories = await getCategoryPreviewFlags(data);

    return {
      success: true,
      data: categories,
      previewDurationSeconds: 15,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getSecondCategories = async (req, categoryId) => {
  try {
    const data =
      await UserPortalRepository.getSecondCategories(categoryId);

    return guardContentAccess({
      req,
      pageType: PREVIEW_PAGE_TYPES.CATEGORY,
      pageId: categoryId,
      data,
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getSubCategories = async (req, secondcategoryId) => {
  try {
    const data =
      await UserPortalRepository.getSubCategories(secondcategoryId);

    return guardContentAccess({
      req,
      pageType: PREVIEW_PAGE_TYPES.SECOND,
      pageId: secondcategoryId,
      data,
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getDetails = async (req, subcategoryId) => {
  try {
    const data =
      await UserPortalRepository.getDetailsBySubCategory(subcategoryId);

    return guardContentAccess({
      req,
      pageType: PREVIEW_PAGE_TYPES.SUB,
      pageId: subcategoryId,
      data,
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getNextLevel = async (req, type, id) => {
  try {
    if (type === "category") {
      const directDetails =
        await UserPortalRepository.getDetailsByCategory(id);

      if (directDetails.length > 0) {
        return guardContentAccess({
          req,
          pageType: PREVIEW_PAGE_TYPES.CATEGORY,
          pageId: id,
          data: directDetails,
          type: "details",
        });
      }

      const second =
        await UserPortalRepository.getSecondCategories(id);

      if (second.length > 0) {
        return guardContentAccess({
          req,
          pageType: PREVIEW_PAGE_TYPES.CATEGORY,
          pageId: id,
          data: second,
          type: "secondcategory",
        });
      }

      return guardContentAccess({
        req,
        pageType: PREVIEW_PAGE_TYPES.CATEGORY,
        pageId: id,
        data: [],
        type: "details",
      });
    }

    if (type === "second") {
      const details =
        await UserPortalRepository.getDetailsBySecond(id);

      if (details.length > 0) {
        return guardContentAccess({
          req,
          pageType: PREVIEW_PAGE_TYPES.SECOND,
          pageId: id,
          data: details,
          type: "details",
        });
      }

      const sub =
        await UserPortalRepository.getSubCategories(id);

      if (sub.length > 0) {
        return guardContentAccess({
          req,
          pageType: PREVIEW_PAGE_TYPES.SECOND,
          pageId: id,
          data: sub,
          type: "subcategory",
        });
      }

      return guardContentAccess({
        req,
        pageType: PREVIEW_PAGE_TYPES.SECOND,
        pageId: id,
        data: [],
        type: "details",
      });
    }

    if (type === "sub") {
      const details =
        await UserPortalRepository.getDetailsBySubCategory(id);

      return guardContentAccess({
        req,
        pageType: PREVIEW_PAGE_TYPES.SUB,
        pageId: id,
        data: details,
        type: "details",
      });
    }

    return { success: false, message: "Invalid type" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
