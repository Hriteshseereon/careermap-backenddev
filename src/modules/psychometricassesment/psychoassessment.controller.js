import {
  assessmentService
} from "./psychoassessment.service.js";


const getUserId = (req) => {
  return req.user?.id || req.user?.userId;
};


export const assessmentController = {

  // =========================================================
  // ADMIN: ASSESSMENTS
  // =========================================================

  createAssessment: async (req, res) => {
    try {
      const result = await assessmentService.createAssessment(req.body);
      return res.status(201).json({
        success: true,
        message: "Assessment created successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  seedDefaultAssessmentAndQuestions: async (req, res) => {
    try {
      const assessmentId = req.body?.assessmentId || req.params?.assessmentId || null;
      const result = await assessmentService.seedDefaultAssessmentAndQuestions(assessmentId);
      return res.status(200).json({
        success: true,
        message: "Default assessment, 6 sections, and 163 questions seeded successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAllAssessments: async (req, res) => {
    try {
      const result = await assessmentService.getAllAssessments(req.query);
      return res.status(200).json({
        success: true,
        data: result.assessments,
        pagination: result.pagination
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAssessmentByIdAdmin: async (req, res) => {
    try {
      const result = await assessmentService.getAssessmentByIdAdmin(req.params.assessmentId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  updateAssessment: async (req, res) => {
    try {
      const result = await assessmentService.updateAssessment(req.params.assessmentId, req.body);
      return res.status(200).json({
        success: true,
        message: "Assessment updated successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateAssessmentStatus: async (req, res) => {
    try {
      const result = await assessmentService.updateAssessmentStatus(req.params.assessmentId, req.body.status);
      return res.status(200).json({
        success: true,
        message: "Assessment status updated successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteAssessment: async (req, res) => {
    try {
      await assessmentService.deleteAssessment(req.params.assessmentId);
      return res.status(200).json({
        success: true,
        message: "Assessment deleted successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },


  // =========================================================
  // ADMIN: SECTIONS
  // =========================================================

  createSection: async (req, res) => {
    try {
      const result = await assessmentService.createSection(
        req.params.assessmentId,
        req.body
      );
      return res.status(201).json({
        success: true,
        message: "Section created successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAllSections: async (req, res) => {
    try {
      const result = await assessmentService.getAllSections(req.query);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getSectionsByAssessment: async (req, res) => {
    try {
      const result = await assessmentService.getSectionsByAssessment(req.params.assessmentId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getSectionById: async (req, res) => {
    try {
      const result = await assessmentService.getSectionById(req.params.sectionId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  updateSection: async (req, res) => {
    try {
      const result = await assessmentService.updateSection(req.params.sectionId, req.body);
      return res.status(200).json({
        success: true,
        message: "Section updated successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteSection: async (req, res) => {
    try {
      await assessmentService.deleteSection(req.params.sectionId);
      return res.status(200).json({
        success: true,
        message: "Section deleted successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },


  // =========================================================
  // ADMIN: QUESTIONS
  // =========================================================

  createQuestion: async (req, res) => {
    try {
      const result = await assessmentService.createQuestion(
        req.params.sectionId,
        req.body
      );
      return res.status(201).json({
        success: true,
        message: "Question created successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  bulkCreateQuestions: async (req, res) => {
    try {
      const sectionId = req.params?.sectionId || req.body?.sectionId || null;
      const result = await assessmentService.bulkCreateQuestions(sectionId, req.body);
      return res.status(201).json({
        success: true,
        message: `${result.length} questions created successfully`,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAllQuestions: async (req, res) => {
    try {
      const result = await assessmentService.getAllQuestions(req.query);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getQuestionsBySection: async (req, res) => {
    try {
      const result = await assessmentService.getQuestionsBySection(req.params.sectionId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getQuestionsByAssessment: async (req, res) => {
    try {
      const result = await assessmentService.getQuestionsByAssessment(req.params.assessmentId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getQuestionById: async (req, res) => {
    try {
      const result = await assessmentService.getQuestionById(req.params.questionId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  updateQuestion: async (req, res) => {
    try {
      const result = await assessmentService.updateQuestion(req.params.questionId, req.body);
      return res.status(200).json({
        success: true,
        message: "Question updated successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteQuestion: async (req, res) => {
    try {
      await assessmentService.deleteQuestion(req.params.questionId);
      return res.status(200).json({
        success: true,
        message: "Question deleted successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },


  // =========================================================
  // ADMIN: OPTIONS
  // =========================================================

  createOptions: async (req, res) => {
    try {
      const result = await assessmentService.createOptions(
        req.params.questionId,
        req.body.options || req.body
      );
      return res.status(201).json({
        success: true,
        message: "Options created successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getOptionsByQuestion: async (req, res) => {
    try {
      const result = await assessmentService.getOptionsByQuestion(req.params.questionId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateOptionsForQuestion: async (req, res) => {
    try {
      const result = await assessmentService.updateOptionsForQuestion(
        req.params.questionId,
        req.body.options || req.body
      );
      return res.status(200).json({
        success: true,
        message: "Options updated successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateSingleOption: async (req, res) => {
    try {
      const result = await assessmentService.updateSingleOption(req.params.optionId, req.body);
      return res.status(200).json({
        success: true,
        message: "Option updated successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteSingleOption: async (req, res) => {
    try {
      await assessmentService.deleteSingleOption(req.params.optionId);
      return res.status(200).json({
        success: true,
        message: "Option deleted successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },


  // =========================================================
  // ADMIN: CAREER CLUSTERS & WEIGHTS
  // =========================================================

  createCareerCluster: async (req, res) => {
    try {
      const result = await assessmentService.createCareerCluster(req.body);
      return res.status(201).json({
        success: true,
        message: "Career cluster created successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAllCareerClusters: async (req, res) => {
    try {
      const result = await assessmentService.getAllCareerClusters();
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  seedDefaultCareerClusters: async (req, res) => {
    try {
      const result = await assessmentService.seedDefaultCareerClusters();
      return res.status(200).json({
        success: true,
        message: "Default 18 career clusters and weights seeded successfully",
        count: result.length,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  bulkImportCareerClusters: async (req, res) => {
    try {
      const clusters = Array.isArray(req.body) ? req.body : req.body.clusters;
      const result = await assessmentService.bulkImportCareerClusters(clusters);
      return res.status(200).json({
        success: true,
        message: "Career clusters imported successfully",
        count: result.length,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getCareerClusterById: async (req, res) => {
    try {
      const result = await assessmentService.getCareerClusterById(req.params.clusterId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  updateCareerCluster: async (req, res) => {
    try {
      const result = await assessmentService.updateCareerCluster(req.params.clusterId, req.body);
      return res.status(200).json({
        success: true,
        message: "Career cluster updated successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteCareerCluster: async (req, res) => {
    try {
      await assessmentService.deleteCareerCluster(req.params.clusterId);
      return res.status(200).json({
        success: true,
        message: "Career cluster deleted successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  createCareerClusterWeight: async (req, res) => {
    try {
      const result = await assessmentService.createCareerClusterWeight(
        req.params.clusterId,
        req.body
      );
      return res.status(201).json({
        success: true,
        message: "Cluster weight created successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getWeightsByCluster: async (req, res) => {
    try {
      const result = await assessmentService.getWeightsByCluster(req.params.clusterId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  bulkUpdateClusterWeights: async (req, res) => {
    try {
      const result = await assessmentService.bulkUpdateClusterWeights(
        req.params.clusterId,
        req.body.weights || req.body
      );
      return res.status(200).json({
        success: true,
        message: "Cluster weights updated successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateSingleClusterWeight: async (req, res) => {
    try {
      const result = await assessmentService.updateSingleClusterWeight(req.params.weightId, req.body);
      return res.status(200).json({
        success: true,
        message: "Cluster weight updated successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteSingleClusterWeight: async (req, res) => {
    try {
      await assessmentService.deleteSingleClusterWeight(req.params.weightId);
      return res.status(200).json({
        success: true,
        message: "Cluster weight deleted successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },


  // =========================================================
  // ADMIN: ATTEMPTS & RESULTS MANAGEMENT
  // =========================================================

  getAllAttemptsAdmin: async (req, res) => {
    try {
      const result = await assessmentService.getAllAttemptsAdmin(req.query);
      return res.status(200).json({
        success: true,
        data: result.attempts,
        pagination: result.pagination
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAttemptByIdAdmin: async (req, res) => {
    try {
      const result = await assessmentService.getAttemptByIdAdmin(req.params.attemptId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteAttemptAdmin: async (req, res) => {
    try {
      await assessmentService.deleteAttemptAdmin(req.params.attemptId);
      return res.status(200).json({
        success: true,
        message: "Attempt deleted successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  recalculateAttempt: async (req, res) => {
    try {
      const result = await assessmentService.recalculateAttempt(req.params.attemptId);
      return res.status(200).json({
        success: true,
        message: "Attempt recalculated successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },


  // =========================================================
  // USER: TEST TAKING & RESULTS
  // =========================================================

  getPublishedAssessments: async (req, res) => {
    try {
      const userId = getUserId(req);
      const result = await assessmentService.getPublishedAssessments(userId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAssessment: async (req, res) => {
    try {
      const result = await assessmentService.getAssessment(req.params.assessmentId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  checkUserAccess: async (req, res) => {
    try {
      const userId = getUserId(req);
      const result = await assessmentService.verifyUserAssessmentAccess(userId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  startAttempt: async (req, res) => {
    try {
      const userId = getUserId(req);
      const result = await assessmentService.startAttempt(userId, req.params.assessmentId);
      return res.status(201).json({
        success: true,
        message: "Assessment started successfully",
        data: result
      });
    } catch (error) {
      const statusCode = error.status || 400;
      return res.status(statusCode).json({
        success: false,
        reason: error.reason || "ERROR",
        requiresNewPlan: Boolean(error.requiresNewPlan),
        message: error.message
      });
    }
  },

  getAttemptStatus: async (req, res) => {
    try {
      const userId = getUserId(req);
      const result = await assessmentService.getAttemptStatus(userId, req.params.attemptId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAttemptQuestions: async (req, res) => {
    try {
      const userId = getUserId(req);
      const result = await assessmentService.getAttemptQuestions(userId, req.params.attemptId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getMyAttempts: async (req, res) => {
    try {
      const userId = getUserId(req);
      const result = await assessmentService.getMyAttempts(userId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  saveAnswer: async (req, res) => {
    try {
      const userId = getUserId(req);
      const result = await assessmentService.saveAnswer(userId, req.params.attemptId, req.body);
      return res.status(200).json({
        success: true,
        message: "Answer saved successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  saveBatchAnswers: async (req, res) => {
    try {
      const userId = getUserId(req);
      const result = await assessmentService.saveBatchAnswers(
        userId,
        req.params.attemptId,
        req.body.answers || req.body
      );
      return res.status(200).json({
        success: true,
        message: "Batch answers saved successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  submitAttempt: async (req, res) => {
    try {
      const userId = getUserId(req);
      const result = await assessmentService.submitAttempt(userId, req.params.attemptId);
      return res.status(200).json({
        success: true,
        message: "Assessment submitted and scored successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getResult: async (req, res) => {
    try {
      const userId = getUserId(req);
      const result = await assessmentService.getResult(userId, req.params.attemptId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // =========================================================
  // CAREER PLANNING TRACK / PERSONAL PROFILING (CRI)
  // =========================================================

  getProfilingQuestions: async (req, res) => {
    try {
      const result = await assessmentService.getProfilingQuestions();
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  calculateProfiling: async (req, res) => {
    try {
      const answers = req.body?.answers || req.body;
      const options = {
        requireSP: req.body?.requireSP !== undefined ? Boolean(req.body.requireSP) : true
      };
      const result = await assessmentService.calculateProfilingLive(answers, options);
      return res.status(200).json({
        success: true,
        message: "Profiling calculation completed successfully",
        data: result
      });
    } catch (error) {
      return res.status(error.status || 400).json({
        success: false,
        message: error.message,
        missingItems: error.missingItems || undefined
      });
    }
  },

  getProfilingTestCases: async (req, res) => {
    try {
      const result = await assessmentService.getProfilingTestCases();
      return res.status(200).json({
        success: true,
        message: "Profiling test cases and engine verification retrieved",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Send / Resend report email
  sendReportEmail: async (req, res) => {
    try {
      const userId = getUserId(req);
      const customEmail = req.body?.email || null;
      const result = await assessmentService.sendAttemptReportEmail(userId, req.params.attemptId, customEmail);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

};