import prisma from "../../config/db.js";
import {
  canAccessAssessment,
  isAssessmentModule,
} from "../../constants/assessmentAccess.js";
import { AssessmentRepository } from "./assessment.repository.js";

const ensureAssessmentAccess = async (userId) => {
  const user = await prisma.users.findUnique({
    where: { id: Number(userId) },
    select: { isInstituteStudent: true },
  });

  // Institute students: free access
  if (canAccessAssessment(user)) {
    return null;
  }

  // 1st free attempt check: if user has 0 completed attempts, it is free
  const completedAttemptsCount = await prisma.assessmentAttempt.count({
    where: {
      userId: Number(userId),
      status: "completed",
    },
  });

  if (completedAttemptsCount === 0) {
    return null;
  }

  // Normal users: unlock only if an active plan includes assessment
  const subscriptions = await prisma.subscriptions.findMany({
    where: {
      userId: Number(userId),
      status: "active",
      endDate: { gte: new Date() },
    },
    include: {
      plan: {
        include: { modules: true },
      },
    },
  });

  const hasPlanAccess = subscriptions.some((subscription) =>
    subscription.plan.modules.some((mod) => isAssessmentModule(mod))
  );

  if (!hasPlanAccess) {
    return {
      success: false,
      status: 403,
      message:
        "Assessment is locked. Please purchase a plan to unlock access.",
    };
  }

  return null;
};

export const submitAssessment = async (userId, data) => {
  const accessError = await ensureAssessmentAccess(userId);
  if (accessError) {
    return accessError;
  }

  const {
    studentName,
    className,
    school,
    testVersion,
    answers,
    report,
    completedAt,
  } = data;

  if (!studentName || !className) {
    return {
      success: false,
      status: 400,
      message: "Student name and class are required.",
    };
  }

  if (!answers || !report) {
    return {
      success: false,
      status: 400,
      message: "Assessment data is missing.",
    };
  }
//   const existing =
//   await AssessmentRepository.getLatestAssessmentByUserId(userId);

// if (existing) {
//   return {
//     success: false,
//     status: 400,
//     message: "Assessment already completed.",
//   };
// }
  const assessment = await AssessmentRepository.createAssessment({
    userId,
    studentName,
    className,
    school,
    testVersion,
    answers,
    report,
    completedAt: completedAt ? new Date(completedAt) : new Date(),
  });

  return {
    success: true,
    status: 201,
    message: "Assessment submitted successfully.",
    data: assessment,
  };
};

export const getMyAssessment = async (userId) => {
  const accessError = await ensureAssessmentAccess(userId);
  if (accessError) {
    return accessError;
  }

  const assessment =
    await AssessmentRepository.getLatestAssessmentByUserId(userId);

  if (!assessment) {
    return {
      success: false,
      status: 404,
      message: "Assessment not found.",
    };
  }

  return {
    success: true,
    status: 200,
    data: assessment,
  };
};

export const getAssessmentById = async (userId, id) => {
  const accessError = await ensureAssessmentAccess(userId);
  if (accessError) {
    return accessError;
  }

  const assessment =
    await AssessmentRepository.getAssessmentById(Number(id));

  // Users can only read / delete their own assessments.
  if (!assessment || Number(assessment.userId) !== Number(userId)) {
    return {
      success: false,
      status: 404,
      message: "Assessment not found.",
    };
  }

  return {
    success: true,
    status: 200,
    data: assessment,
  };
};

export const deleteAssessment = async (userId, id) => {
  const accessError = await ensureAssessmentAccess(userId);
  if (accessError) {
    return accessError;
  }

  const assessment =
    await AssessmentRepository.getAssessmentById(Number(id));

  // Users can only read / delete their own assessments.
  if (!assessment || Number(assessment.userId) !== Number(userId)) {
    return {
      success: false,
      status: 404,
      message: "Assessment not found.",
    };
  }

  await AssessmentRepository.deleteAssessment(Number(id));

  return {
    success: true,
    status: 200,
    message: "Assessment deleted successfully.",
  };
};
