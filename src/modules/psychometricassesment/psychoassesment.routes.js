import express from "express";

import {
  assessmentController
} from "./psychoassessment.controller.js";

import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import { protectAuth } from "../../middlewares/protectAuth.js";

const router = express.Router();


// ============================================================
// ADMIN: ASSESSMENTS
// ============================================================

router.post(
  "/admin/assessments/seed-defaults",
  protectAdminOrStaff,
  assessmentController.seedDefaultAssessmentAndQuestions
);

router.post(
  "/admin/questions/seed-defaults",
  protectAdminOrStaff,
  assessmentController.seedDefaultAssessmentAndQuestions
);

router.post(
  "/admin/assessments",
  protectAdminOrStaff,
  assessmentController.createAssessment
);

router.get(
  "/admin/assessments",
  protectAdminOrStaff,
  assessmentController.getAllAssessments
);

router.get(
  "/admin/assessments/:assessmentId",
  protectAdminOrStaff,
  assessmentController.getAssessmentByIdAdmin
);

router.put(
  "/admin/assessments/:assessmentId",
  protectAdminOrStaff,
  assessmentController.updateAssessment
);

router.patch(
  "/admin/assessments/:assessmentId/status",
  protectAdminOrStaff,
  assessmentController.updateAssessmentStatus
);

router.delete(
  "/admin/assessments/:assessmentId",
  protectAdminOrStaff,
  assessmentController.deleteAssessment
);


// ============================================================
// ADMIN: SECTIONS
// ============================================================

router.post(
  "/admin/assessments/:assessmentId/sections",
  protectAdminOrStaff,
  assessmentController.createSection
);

router.get(
  "/admin/sections",
  protectAdminOrStaff,
  assessmentController.getAllSections
);

router.get(
  "/admin/assessments/:assessmentId/sections",
  protectAdminOrStaff,
  assessmentController.getSectionsByAssessment
);

router.get(
  "/admin/sections/:sectionId",
  protectAdminOrStaff,
  assessmentController.getSectionById
);

router.put(
  "/admin/sections/:sectionId",
  protectAdminOrStaff,
  assessmentController.updateSection
);

router.delete(
  "/admin/sections/:sectionId",
  protectAdminOrStaff,
  assessmentController.deleteSection
);


// ============================================================
// ADMIN: QUESTIONS
// ============================================================

router.post(
  "/admin/assessment-sections/:sectionId/questions",
  protectAdminOrStaff,
  assessmentController.createQuestion
);

router.post(
  "/admin/sections/:sectionId/questions",
  protectAdminOrStaff,
  assessmentController.createQuestion
);

router.post(
  "/admin/sections/:sectionId/questions/bulk",
  protectAdminOrStaff,
  assessmentController.bulkCreateQuestions
);

router.post(
  "/admin/questions/bulk",
  protectAdminOrStaff,
  assessmentController.bulkCreateQuestions
);

router.get(
  "/admin/sections/:sectionId/questions",
  protectAdminOrStaff,
  assessmentController.getQuestionsBySection
);

router.get(
  "/admin/assessments/:assessmentId/questions",
  protectAdminOrStaff,
  assessmentController.getQuestionsByAssessment
);

router.get(
  "/admin/questions",
  protectAdminOrStaff,
  assessmentController.getAllQuestions
);

router.get(
  "/admin/questions/:questionId",
  protectAdminOrStaff,
  assessmentController.getQuestionById
);

router.put(
  "/admin/questions/:questionId",
  protectAdminOrStaff,
  assessmentController.updateQuestion
);

router.delete(
  "/admin/questions/:questionId",
  protectAdminOrStaff,
  assessmentController.deleteQuestion
);


// ============================================================
// ADMIN: OPTIONS
// ============================================================

router.post(
  "/admin/questions/:questionId/options",
  protectAdminOrStaff,
  assessmentController.createOptions
);

router.get(
  "/admin/questions/:questionId/options",
  protectAdminOrStaff,
  assessmentController.getOptionsByQuestion
);

router.put(
  "/admin/questions/:questionId/options",
  protectAdminOrStaff,
  assessmentController.updateOptionsForQuestion
);

router.put(
  "/admin/options/:optionId",
  protectAdminOrStaff,
  assessmentController.updateSingleOption
);

router.delete(
  "/admin/options/:optionId",
  protectAdminOrStaff,
  assessmentController.deleteSingleOption
);


// ============================================================
// ADMIN: CAREER CLUSTERS & WEIGHTS
// ============================================================

router.post(
  "/admin/career-clusters/seed-defaults",
  protectAdminOrStaff,
  assessmentController.seedDefaultCareerClusters
);

router.post(
  "/admin/career-clusters/bulk-import",
  protectAdminOrStaff,
  assessmentController.bulkImportCareerClusters
);

router.post(
  "/admin/career-clusters",
  protectAdminOrStaff,
  assessmentController.createCareerCluster
);

router.get(
  "/admin/career-clusters",
  protectAdminOrStaff,
  assessmentController.getAllCareerClusters
);

router.get(
  "/admin/career-clusters/:clusterId",
  protectAdminOrStaff,
  assessmentController.getCareerClusterById
);

router.put(
  "/admin/career-clusters/:clusterId",
  protectAdminOrStaff,
  assessmentController.updateCareerCluster
);

router.delete(
  "/admin/career-clusters/:clusterId",
  protectAdminOrStaff,
  assessmentController.deleteCareerCluster
);

router.post(
  "/admin/career-clusters/:clusterId/weights",
  protectAdminOrStaff,
  assessmentController.createCareerClusterWeight
);

router.get(
  "/admin/career-clusters/:clusterId/weights",
  protectAdminOrStaff,
  assessmentController.getWeightsByCluster
);

router.put(
  "/admin/career-clusters/:clusterId/weights",
  protectAdminOrStaff,
  assessmentController.bulkUpdateClusterWeights
);

router.put(
  "/admin/career-cluster-weights/:weightId",
  protectAdminOrStaff,
  assessmentController.updateSingleClusterWeight
);

router.delete(
  "/admin/career-cluster-weights/:weightId",
  protectAdminOrStaff,
  assessmentController.deleteSingleClusterWeight
);


// ============================================================
// ADMIN: ATTEMPTS & RESULTS MANAGEMENT
// ============================================================

router.get(
  "/admin/attempts",
  protectAdminOrStaff,
  assessmentController.getAllAttemptsAdmin
);

router.get(
  "/admin/attempts/:attemptId",
  protectAdminOrStaff,
  assessmentController.getAttemptByIdAdmin
);

router.delete(
  "/admin/attempts/:attemptId",
  protectAdminOrStaff,
  assessmentController.deleteAttemptAdmin
);

router.post(
  "/admin/attempts/:attemptId/recalculate",
  protectAdminOrStaff,
  assessmentController.recalculateAttempt
);


// ============================================================
// USER: ASSESSMENTS & TEST TAKING
// ============================================================

router.get(
  "/assessments",
  protectAuth,
  assessmentController.getPublishedAssessments
);

router.get(
  "/assessment/user/access-status",
  protectAuth,
  assessmentController.checkUserAccess
);

router.get(
  "/assessment/my-attempts",
  protectAuth,
  assessmentController.getMyAttempts
);

router.get(
  "/assessment/:assessmentId",
  protectAuth,
  assessmentController.getAssessment
);

router.post(
  "/assessment/:assessmentId/start",
  protectAuth,
  assessmentController.startAttempt
);

router.get(
  "/assessment/attempt/:attemptId/status",
  protectAuth,
  assessmentController.getAttemptStatus
);

router.get(
  "/assessment/attempt/:attemptId/questions",
  protectAuth,
  assessmentController.getAttemptQuestions
);

router.post(
  "/assessment/attempt/:attemptId/answer",
  protectAuth,
  assessmentController.saveAnswer
);

router.post(
  "/assessment/attempt/:attemptId/batch-answers",
  protectAuth,
  assessmentController.saveBatchAnswers
);

router.post(
  "/assessment/attempt/:attemptId/submit",
  protectAuth,
  assessmentController.submitAttempt
);

router.get(
  "/assessment/attempt/:attemptId/result",
  protectAuth,
  assessmentController.getResult
);

router.post(
  "/assessment/attempt/:attemptId/send-report-email",
  protectAuth,
  assessmentController.sendReportEmail
);


// ============================================================
// CAREER PLANNING TRACK / PERSONAL PROFILING (CRI)
// ============================================================

router.get(
  "/profiling/questions",
  assessmentController.getProfilingQuestions
);

router.post(
  "/profiling/calculate",
  assessmentController.calculateProfiling
);

router.get(
  "/profiling/test-cases",
  assessmentController.getProfilingTestCases
);

// Also mount under /admin for admin panel preview
router.get(
  "/admin/profiling/questions",
  protectAdminOrStaff,
  assessmentController.getProfilingQuestions
);

router.post(
  "/admin/profiling/calculate",
  protectAdminOrStaff,
  assessmentController.calculateProfiling
);

router.get(
  "/admin/profiling/test-cases",
  protectAdminOrStaff,
  assessmentController.getProfilingTestCases
);


export default router;