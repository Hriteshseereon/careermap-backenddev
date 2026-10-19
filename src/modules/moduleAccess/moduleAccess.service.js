import prisma from "../../config/db.js";
import {
  canAccessAssessment,
  isAssessmentModule,
} from "../../constants/assessmentAccess.js";
import {
  PREVIEW_DURATION_SECONDS,
  PREVIEW_PAGE_TYPES,
} from "../../constants/previewAccess.js";
import { ModuleAccessRepository } from "./moduleAccess.repository.js";

const getActiveSubscription = async (userId) =>
  prisma.subscriptions.findMany({
    where: {
      userId: Number(userId),
      status: "active",
      endDate: {
        gte: new Date(),
      },
    },
    include: {
      plan: {
        include: {
          modules: true,
        },
      },
    },
  });

export const hasFullModuleAccess = async (
  userId,
  moduleId
) => {
  const module = await prisma.module.findUnique({
    where: {
      id: Number(moduleId),
    },
  });

  if (!module) {
    throw new Error("Module not found");
  }

  // Assessment: free for institute students OR 1st time user; otherwise require plan purchase
  if (isAssessmentModule(module)) {
    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
      select: { isInstituteStudent: true },
    });

    if (canAccessAssessment(user)) {
      return {
        allowed: true,
        module,
      };
    }

    // 1st free psychometric test attempt check
    const completedAttemptsCount = await prisma.assessmentAttempt.count({
      where: {
        userId: Number(userId),
        status: "completed",
      },
    });

    if (completedAttemptsCount === 0) {
      return {
        allowed: true,
        isFreeAttempt: true,
        module,
      };
    }

    const subscriptions = await getActiveSubscription(userId);
    const hasPlanAccess = subscriptions.some((subscription) =>
      subscription.plan.modules.some((item) => item.id === Number(moduleId) || isAssessmentModule(item))
    );

    return {
      allowed: hasPlanAccess,
      module,
    };
  }

  // Free module
  if (module.markas_free) {
    return {
      allowed: true,
      module,
    };
  }

  // Get all active subscriptions
  const subscriptions =
    await getActiveSubscription(userId);

  const hasAccess =
    subscriptions.some((subscription) =>
      subscription.plan.modules.some(
        (item) =>
          item.id === Number(moduleId)
      )
    );

  if (hasAccess) {
    return {
      allowed: true,
      module,
    };
  }

  return {
    allowed: false,
    module,
  };
};
const getCategoryIdForPage = async (pageType, pageId) => {
  if (pageType === PREVIEW_PAGE_TYPES.CATEGORY) {
    return Number(pageId);
  }

  if (pageType === PREVIEW_PAGE_TYPES.SECOND) {
    const second = await prisma.secondcategory.findUnique({
      where: { id: Number(pageId) },
      select: { categoryId: true },
    });

    return second?.categoryId ?? null;
  }

  if (pageType === PREVIEW_PAGE_TYPES.SUB) {
    const sub = await prisma.subcategory.findUnique({
      where: { id: Number(pageId) },
      select: { categoryId: true },
    });

    return sub?.categoryId ?? null;
  }

  if (pageType === PREVIEW_PAGE_TYPES.DETAILS) {
    const details = await prisma.details.findUnique({
      where: { id: Number(pageId) },
      select: { categoryId: true },
    });

    return details?.categoryId ?? null;
  }

  return null;
};

export const isCareerLibraryPagePreviewEligible = async (pageType, pageId) => {
  const categoryId = await getCategoryIdForPage(pageType, pageId);

  console.log("pageType =", pageType);
  console.log("pageId =", pageId);
  console.log("categoryId =", categoryId);

  if (!categoryId) {
    console.log("categoryId not found");
    return false;
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { category_access: true },
  });

  console.log("category =", category);

  return Boolean(category?.category_access);
};

export const isScholarshipPreviewEligible = async (scholarshipId) => {
  const scholarship = await prisma.scholarship.findUnique({
    where: { id: Number(scholarshipId) },
    select: { is_free: true },
  });

  return Boolean(scholarship?.is_free);
};

const buildPreviewResponse = (session) => {
  const expiresAt = session.expiresAt;
  const remainingSeconds = Math.max(
    0,
    Math.ceil((expiresAt.getTime() - Date.now()) / 1000)
  );

  return {
    allowed: true,
    mode: "preview",
    previewSessionId: session.id,
    expiresAt,
    previewDurationSeconds: PREVIEW_DURATION_SECONDS,
    remainingSeconds,
  };
};

export const checkModuleAccess = async (userId, moduleId) => {
  const { allowed, module } = await hasFullModuleAccess(userId, moduleId);

  if (allowed) {
    return {
      allowed: true,
      mode: "full",
    };
  }

  if (!module.freePreview) {
    return {
      allowed: false,
      mode: "locked",
      message: "Please purchase subscription",
    };
  }

  return {
    allowed: true,
    mode: "preview",
    previewDurationSeconds: PREVIEW_DURATION_SECONDS,
    message:
      "Preview mode: each inside page allows 15 seconds until you purchase.",
  };
};

export const startPagePreview = async (
  userId,
  { moduleId, pageType, pageId }
) => {
  const fullAccess = await hasFullModuleAccess(userId, moduleId);

  if (fullAccess.allowed) {
    return {
      allowed: true,
      mode: "full",
    };
  }

  const module = fullAccess.module;

  if (!module.freePreview) {
    return {
      allowed: false,
      mode: "locked",
      message: "Please purchase subscription",
    };
  }

  let previewEligible = false;

  if (pageType === PREVIEW_PAGE_TYPES.SCHOLARSHIP) {
    previewEligible = await isScholarshipPreviewEligible(pageId);
  } else if (
   pageType === PREVIEW_PAGE_TYPES.MASTERCLASS
) {

   previewEligible =
      await isMasterClassPreviewEligible(pageId);

}
   else {
    previewEligible = await isCareerLibraryPagePreviewEligible(
      pageType,
      pageId
    );
  }

  if (!previewEligible) {
    return {
      allowed: false,
      mode: "locked",
      message: "This content is not available in free preview. Please purchase.",
    };
  }

  const expiresAt = new Date(
    Date.now() + PREVIEW_DURATION_SECONDS * 1000
  );

  const session = await ModuleAccessRepository.createPreviewSession({
    userId,
    moduleId,
    pageType,
    pageId,
    expiresAt,
  });

  return buildPreviewResponse(session);
};

export const verifyPreviewSession = async (userId, previewSessionId) => {
  const session = await ModuleAccessRepository.findPreviewSessionById(
    previewSessionId
  );

  if (!session || session.userId !== Number(userId)) {
    return {
      valid: false,
      message: "Preview session not found",
    };
  }

  const remainingSeconds = Math.max(
    0,
    Math.ceil((session.expiresAt.getTime() - Date.now()) / 1000)
  );

  if (remainingSeconds <= 0) {
    return {
      valid: false,
      expired: true,
      message: "Preview time expired. Please purchase to continue.",
      expiresAt: session.expiresAt,
      remainingSeconds: 0,
    };
  }

  return {
    valid: true,
    previewSessionId: session.id,
    moduleId: session.moduleId,
    pageType: session.pageType,
    pageId: session.pageId,
    expiresAt: session.expiresAt,
    remainingSeconds,
    previewDurationSeconds: PREVIEW_DURATION_SECONDS,
  };
};

export const resolveContentAccess = async (
  userId,
  { moduleId, pageType, pageId, previewSessionId }
) => {
  if (!userId) {
    return {
      allowed: false,
      mode: "auth_required",
      message: "Login required",
    };
  }

  const fullAccess = await hasFullModuleAccess(userId, moduleId);

  if (fullAccess.allowed) {
    return {
      allowed: true,
      mode: "full",
    };
  }

  if (!fullAccess.module.freePreview) {
    return {
      allowed: false,
      mode: "locked",
      message: "Please purchase subscription",
    };
  }

  if (!previewSessionId) {
    return {
      allowed: false,
      mode: "preview_required",
      message: "Start a preview session to view this page",
      previewDurationSeconds: PREVIEW_DURATION_SECONDS,
    };
  }

  const sessionCheck = await verifyPreviewSession(userId, previewSessionId);

  if (!sessionCheck.valid) {
    return {
      allowed: false,
      mode: "preview_expired",
      message: sessionCheck.message,
      remainingSeconds: 0,
    };
  }

  if (
    sessionCheck.moduleId !== Number(moduleId) ||
    sessionCheck.pageType !== pageType ||
    sessionCheck.pageId !== Number(pageId)
  ) {
    return {
      allowed: false,
      mode: "preview_mismatch",
      message: "Preview session does not match this page",
    };
  }

  return {
    allowed: true,
    mode: "preview",
    expiresAt: sessionCheck.expiresAt,
    remainingSeconds: sessionCheck.remainingSeconds,
    previewDurationSeconds: PREVIEW_DURATION_SECONDS,
  };
};

export const getCategoryPreviewFlags = async (
  userId,
  moduleId,
  categories
) => {

  const fullAccess = await hasFullModuleAccess(
    userId,
    moduleId
  );

  return categories.map((category) => ({
    ...category,

    previewEligible:
      fullAccess.allowed
        ? true
        : Boolean(category.category_access),

    accessTier:
      fullAccess.allowed
        ? "full"
        : category.category_access
        ? "preview"
        : "locked",
  }));
};

export const getScholarshipPreviewFlags = async (scholarships) =>
  scholarships.map((scholarship) => ({
    ...scholarship,
    previewEligible: Boolean(scholarship.is_free),
    accessTier: scholarship.is_free ? "preview" : "locked",
  }));

  export const isMasterClassPreviewEligible = async (id) => {
  const item = await prisma.masterClass.findUnique({
    where: { id: Number(id) },
    select: {
      is_free: true,
    },
  });

  return Boolean(item?.is_free);
};

export const getMasterClassPreviewFlags = async (
  userId,
  moduleId,
  classes
) => {
  const fullAccess = await hasFullModuleAccess(
    userId,
    moduleId
  );

  return classes.map((item) => ({
    ...item,

    previewEligible: fullAccess.allowed
      ? true
      : Boolean(item.is_free),

    accessTier: fullAccess.allowed
      ? "full"
      : item.is_free
      ? "preview"
      : "locked",
  }));
};