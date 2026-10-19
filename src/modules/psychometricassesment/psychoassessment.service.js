import prisma from "../../config/db.js";
import {
  isAssessmentModule,
  canAccessAssessment
} from "../../constants/assessmentAccess.js";
import {
  assessmentRepository
} from "./psychoassessment.repository.js";
import { sendReportEmail } from "../../utils/sendReportEmail.js";

import {
  calculateScores,
  calculateHollandCode,
  calculateClusterMatches,
  buildAssessmentReport,
  normalizeSectionCode
} from "./psychoassessment.engine.js";

import {
  seedCareerClustersToDatabase
} from "./psychoassessment.seed.js";

import {
  seedAssessmentAndQuestions
} from "./psychoassessment.questions.seed.js";

import {
  calculateProfiling,
  validateProfilingAgainstTestCases
} from "./profiling.engine.js";

import {
  PROFILING_QUESTIONS,
  PROFILING_DOMAINS,
  STAGE_BANDS,
  LIKERT_RESPONSE_SCALE,
  SELF_PLACEMENT_OPTIONS,
  TEST_CASES
} from "./profiling.constants.js";


function generateQuestionItemId(sectionCode, facet, count = 1) {
  const code = normalizeSectionCode(sectionCode || "");
  let prefix = "Q";
  if (code === "interest") prefix = "INT";
  else if (code === "personality") prefix = "PER";
  else if (code === "values") prefix = "VAL";
  else if (code === "learning_style") prefix = "VARK";
  else if (code === "goal_orientation") prefix = "GOAL";
  else if (code === "aptitude") prefix = "APT";

  const facetPart = facet ? `_${String(facet).toUpperCase().replace(/[^A-Z0-9]/g, "")}` : "";
  const numPart = String(count).padStart(2, "0");
  return `${prefix}${facetPart}_${numPart}`;
}

export const assessmentService = {

  // =========================================================
  // ADMIN: ASSESSMENTS
  // =========================================================

  createAssessment: async (body) => {
    if (!body.title) {
      throw new Error("Assessment title is required");
    }

    if (!body.slug) {
      throw new Error("Assessment slug is required");
    }

    const existingSlug = await assessmentRepository.findAssessmentBySlug(body.slug);
    if (existingSlug) {
      throw new Error(`Assessment with slug "${body.slug}" already exists`);
    }

    return assessmentRepository.createAssessment({
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      version: body.version || "1.0",
      status: body.status || "draft"
    });
  },

  seedDefaultAssessmentAndQuestions: async (targetAssessmentId = null) => {
    return seedAssessmentAndQuestions(targetAssessmentId);
  },

  getAllAssessments: async (query = {}) => {
    const { status, search, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const [assessments, total] = await Promise.all([
      assessmentRepository.findAllAssessments({
        status,
        search,
        skip,
        take: Number(limit)
      }),
      assessmentRepository.countAssessments({ status, search })
    ]);

    return {
      assessments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  },

  getAssessmentByIdAdmin: async (assessmentId) => {
    const assessment = await assessmentRepository.findAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }
    return assessment;
  },

  updateAssessment: async (assessmentId, body) => {
    const existing = await assessmentRepository.findAssessmentById(assessmentId);
    if (!existing) {
      throw new Error("Assessment not found");
    }

    if (body.slug && body.slug !== existing.slug) {
      const slugConflict = await assessmentRepository.findAssessmentBySlug(body.slug);
      if (slugConflict && slugConflict.id !== Number(assessmentId)) {
        throw new Error(`Assessment with slug "${body.slug}" already exists`);
      }
    }

    const updateData = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.version !== undefined) updateData.version = body.version;
    if (body.status !== undefined) updateData.status = body.status;

    return assessmentRepository.updateAssessment(assessmentId, updateData);
  },

  updateAssessmentStatus: async (assessmentId, status) => {
    const validStatuses = ["draft", "published", "archived"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const existing = await assessmentRepository.findAssessmentById(assessmentId);
    if (!existing) {
      throw new Error("Assessment not found");
    }

    return assessmentRepository.updateAssessment(assessmentId, { status });
  },

  deleteAssessment: async (assessmentId) => {
    const existing = await assessmentRepository.findAssessmentById(assessmentId);
    if (!existing) {
      throw new Error("Assessment not found");
    }

    return assessmentRepository.deleteAssessment(assessmentId);
  },


  // =========================================================
  // ADMIN: SECTIONS
  // =========================================================

  createSection: async (assessmentId, body) => {
    const assessment = await assessmentRepository.findAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    if (!body.code) {
      throw new Error("Section code is required (e.g. 'interest', 'personality', 'values', 'aptitude', 'learning_style', 'goal_orientation')");
    }

    if (!body.title) {
      throw new Error("Section title is required");
    }

    const normalizedCode = normalizeSectionCode(body.code);

    const existingSection = await assessmentRepository.findSectionByCode(assessmentId, normalizedCode);
    if (existingSection) {
      throw new Error(`Section with code "${normalizedCode}" already exists in this assessment`);
    }

    return assessmentRepository.createSection({
      assessmentId: Number(assessmentId),
      code: normalizedCode,
      title: body.title,
      description: body.description || null,
      order: body.order !== undefined ? Number(body.order) : 0
    });
  },

  getAllSections: async (query = {}) => {
    const { assessmentId, search, page = 1, limit = 50 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const [sections, total] = await Promise.all([
      assessmentRepository.findAllSections({
        assessmentId: assessmentId ? Number(assessmentId) : undefined,
        search,
        skip,
        take: Number(limit)
      }),
      assessmentRepository.countSections({
        assessmentId: assessmentId ? Number(assessmentId) : undefined,
        search
      })
    ]);

    return {
      sections,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  },

  getSectionsByAssessment: async (assessmentId) => {
    const assessment = await assessmentRepository.findAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    return assessmentRepository.findSectionsByAssessmentId(assessmentId);
  },

  getSectionById: async (sectionId) => {
    const section = await assessmentRepository.findSectionById(sectionId);
    if (!section) {
      throw new Error("Section not found");
    }
    return section;
  },

  updateSection: async (sectionId, body) => {
    const existing = await assessmentRepository.findSectionById(sectionId);
    if (!existing) {
      throw new Error("Section not found");
    }

    const updateData = {};
    if (body.code !== undefined) updateData.code = normalizeSectionCode(body.code);
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.order !== undefined) updateData.order = Number(body.order);

    return assessmentRepository.updateSection(sectionId, updateData);
  },

  deleteSection: async (sectionId) => {
    const existing = await assessmentRepository.findSectionById(sectionId);
    if (!existing) {
      throw new Error("Section not found");
    }

    return assessmentRepository.deleteSection(sectionId);
  },


  // =========================================================
  // ADMIN: QUESTIONS
  // =========================================================

  createQuestion: async (sectionId, body) => {
    const section = await assessmentRepository.findSectionById(sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    if (!body.text) {
      throw new Error("Question text is required");
    }

    if (!body.type) {
      throw new Error("Question type is required ('likert5' or 'mcq')");
    }

    // Auto-generate item code (itemId) if not manually supplied
    let itemId = body.itemId ? String(body.itemId).trim() : null;
    if (!itemId) {
      const questionsCount = await assessmentRepository.countQuestionsBySectionId(sectionId);
      itemId = generateQuestionItemId(section.code, body.facet, questionsCount + 1);

      let counter = questionsCount + 1;
      let existingQuestion = await assessmentRepository.findQuestionByItemId(sectionId, itemId);
      while (existingQuestion) {
        counter += 1;
        itemId = generateQuestionItemId(section.code, body.facet, counter);
        existingQuestion = await assessmentRepository.findQuestionByItemId(sectionId, itemId);
      }
    } else {
      const existingQuestion = await assessmentRepository.findQuestionByItemId(sectionId, itemId);
      if (existingQuestion) {
        throw new Error(`Question with itemId "${itemId}" already exists in this section`);
      }
    }

    const question = await assessmentRepository.createQuestion({
      sectionId: Number(sectionId),
      itemId,
      text: body.text,
      type: body.type,
      facet: body.facet || null,
      reverse: Boolean(body.reverse),
      image: body.image || null,
      note: body.note || null,
      order: body.order !== undefined ? Number(body.order) : 0
    });

    // Optionally create options inline for MCQ
    if (body.type === "mcq" && Array.isArray(body.options) && body.options.length > 0) {
      await assessmentRepository.createOptions(question.id, body.options);
      return assessmentRepository.findQuestionById(question.id);
    }

    return question;
  },

  bulkCreateQuestions: async (targetSectionId, payload) => {
    let questionsArray = [];
    let commonDefaults = {};

    if (Array.isArray(payload)) {
      questionsArray = payload;
    } else if (payload && typeof payload === "object") {
      questionsArray = payload.questions || [];
      commonDefaults = {
        sectionId: payload.sectionId || targetSectionId,
        facet: payload.facet,
        type: payload.type,
        reverse: payload.reverse
      };
    }

    if (!Array.isArray(questionsArray) || !questionsArray.length) {
      throw new Error("Questions array is required");
    }

    const createdQuestions = [];

    for (let i = 0; i < questionsArray.length; i++) {
      const item = questionsArray[i];
      const sectionId = item.sectionId || commonDefaults.sectionId || targetSectionId;

      if (!sectionId) {
        throw new Error(`Section ID is required for question index ${i}`);
      }

      if (!item.text) {
        throw new Error(`Question text is required at index ${i}`);
      }

      const section = await assessmentRepository.findSectionById(sectionId);
      if (!section) {
        throw new Error(`Section with ID ${sectionId} not found at index ${i}`);
      }

      const qFacet = item.facet || commonDefaults.facet || null;
      const qReverse = item.reverse !== undefined ? Boolean(item.reverse) : Boolean(commonDefaults.reverse);
      const qType = item.type || commonDefaults.type || (item.options?.length ? "mcq" : "likert5");

      // Auto-generate item code
      let itemId = item.itemId ? String(item.itemId).trim() : null;
      if (!itemId) {
        const count = await assessmentRepository.countQuestionsBySectionId(sectionId);
        itemId = generateQuestionItemId(section.code, qFacet, count + 1 + i);
      }

      const existing = await assessmentRepository.findQuestionByItemId(sectionId, itemId);
      if (existing) {
        itemId = `${itemId}_${Date.now().toString().slice(-4)}_${i}`;
      }

      const qOrder = item.order !== undefined ? Number(item.order) : i + 1;

      const question = await assessmentRepository.createQuestion({
        sectionId: Number(sectionId),
        itemId,
        text: item.text,
        type: qType,
        facet: qFacet,
        reverse: qReverse,
        image: item.image || null,
        note: item.note || null,
        order: qOrder
      });

      if (qType === "mcq" && Array.isArray(item.options) && item.options.length > 0) {
        await assessmentRepository.createOptions(question.id, item.options);
      }

      const fullQuestion = await assessmentRepository.findQuestionById(question.id);
      createdQuestions.push(fullQuestion);
    }

    return createdQuestions;
  },

  getAllQuestions: async (query = {}) => {
    const {
      assessmentId,
      sectionId,
      search,
      type,
      facet,
      page = 1,
      limit = 50
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const [questions, total] = await Promise.all([
      assessmentRepository.findAllQuestions({
        assessmentId: assessmentId ? Number(assessmentId) : undefined,
        sectionId: sectionId ? Number(sectionId) : undefined,
        search,
        type,
        facet,
        skip,
        take: Number(limit)
      }),
      assessmentRepository.countQuestions({
        assessmentId: assessmentId ? Number(assessmentId) : undefined,
        sectionId: sectionId ? Number(sectionId) : undefined,
        search,
        type,
        facet
      })
    ]);

    return {
      questions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  },

  getQuestionsBySection: async (sectionId) => {
    const section = await assessmentRepository.findSectionById(sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    return assessmentRepository.findQuestionsBySectionId(sectionId);
  },

  getQuestionsByAssessment: async (assessmentId) => {
    const assessment = await assessmentRepository.findAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    return assessmentRepository.findQuestionsByAssessmentId(assessmentId);
  },

  getQuestionById: async (questionId) => {
    const question = await assessmentRepository.findQuestionById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }
    return question;
  },

  updateQuestion: async (questionId, body) => {
    const existing = await assessmentRepository.findQuestionById(questionId);
    if (!existing) {
      throw new Error("Question not found");
    }

    const updateData = {};
    if (body.itemId !== undefined) updateData.itemId = body.itemId;
    if (body.text !== undefined) updateData.text = body.text;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.facet !== undefined) updateData.facet = body.facet;
    if (body.reverse !== undefined) updateData.reverse = Boolean(body.reverse);
    if (body.image !== undefined) updateData.image = body.image;
    if (body.note !== undefined) updateData.note = body.note;
    if (body.order !== undefined) updateData.order = Number(body.order);

    const updated = await assessmentRepository.updateQuestion(questionId, updateData);

    // If options are provided for MCQ, replace options
    if (Array.isArray(body.options)) {
      await assessmentRepository.deleteOptionsByQuestionId(questionId);
      if (body.options.length > 0) {
        await assessmentRepository.createOptions(questionId, body.options);
      }
      return assessmentRepository.findQuestionById(questionId);
    }

    return updated;
  },

  deleteQuestion: async (questionId) => {
    const existing = await assessmentRepository.findQuestionById(questionId);
    if (!existing) {
      throw new Error("Question not found");
    }

    return assessmentRepository.deleteQuestion(questionId);
  },


  // =========================================================
  // ADMIN: OPTIONS
  // =========================================================

  createOptions: async (questionId, options) => {
    if (!Array.isArray(options) || !options.length) {
      throw new Error("Options array is required");
    }

    const question = await assessmentRepository.findQuestionById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    if (question.type === "likert5") {
      throw new Error("Likert-scale questions do not require custom options");
    }

    const correctCount = options.filter((opt) => opt.isCorrect === true).length;
    if (correctCount !== 1) {
      throw new Error("Exactly one option must be marked as correct (isCorrect: true)");
    }

    await assessmentRepository.createOptions(questionId, options);
    return assessmentRepository.findOptionsByQuestionId(questionId);
  },

  getOptionsByQuestion: async (questionId) => {
    const question = await assessmentRepository.findQuestionById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    return assessmentRepository.findOptionsByQuestionId(questionId);
  },

  updateOptionsForQuestion: async (questionId, options) => {
    if (!Array.isArray(options) || !options.length) {
      throw new Error("Options array is required");
    }

    const question = await assessmentRepository.findQuestionById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    const correctCount = options.filter((opt) => opt.isCorrect === true).length;
    if (correctCount !== 1) {
      throw new Error("Exactly one option must be marked as correct (isCorrect: true)");
    }

    await assessmentRepository.deleteOptionsByQuestionId(questionId);
    await assessmentRepository.createOptions(questionId, options);
    return assessmentRepository.findOptionsByQuestionId(questionId);
  },

  updateSingleOption: async (optionId, body) => {
    const existing = await assessmentRepository.findOptionById(optionId);
    if (!existing) {
      throw new Error("Option not found");
    }

    const updateData = {};
    if (body.optionText !== undefined) updateData.optionText = body.optionText;
    if (body.optionIndex !== undefined) updateData.optionIndex = Number(body.optionIndex);
    if (body.isCorrect !== undefined) updateData.isCorrect = Boolean(body.isCorrect);
    if (body.image !== undefined) updateData.image = body.image;

    return assessmentRepository.updateOption(optionId, updateData);
  },

  deleteSingleOption: async (optionId) => {
    const existing = await assessmentRepository.findOptionById(optionId);
    if (!existing) {
      throw new Error("Option not found");
    }

    return assessmentRepository.deleteOption(optionId);
  },


  // =========================================================
  // ADMIN: CAREER CLUSTERS & WEIGHTS
  // =========================================================

  createCareerCluster: async (body) => {
    if (!body.code) {
      throw new Error("Career cluster code is required (e.g. 'ENG_TECH', 'HEALTH_SCI')");
    }

    if (!body.name) {
      throw new Error("Career cluster name is required");
    }

    const existing = await assessmentRepository.findCareerClusterByCode(body.code);
    if (existing) {
      throw new Error(`Career cluster with code "${body.code}" already exists`);
    }

    const cluster = await assessmentRepository.createCareerCluster({
      code: body.code,
      name: body.name,
      hollandCode: body.hollandCode || null,
      description: body.description || null
    });

    // If weights are provided inline (as array or object)
    if (body.weights && typeof body.weights === "object") {
      const weightsList = Array.isArray(body.weights)
        ? body.weights
        : Object.entries(body.weights).map(([facet, weight]) => ({ facet, weight }));

      for (const w of weightsList) {
        if (w.facet && w.weight !== undefined) {
          await assessmentRepository.upsertCareerClusterWeight(cluster.id, w.facet, Number(w.weight));
        }
      }
      return assessmentRepository.findCareerClusterById(cluster.id);
    }

    return cluster;
  },

  getAllCareerClusters: async () => {
    return assessmentRepository.getCareerClusters();
  },

  seedDefaultCareerClusters: async () => {
    return seedCareerClustersToDatabase();
  },

  bulkImportCareerClusters: async (clustersArray) => {
    if (!Array.isArray(clustersArray) || !clustersArray.length) {
      throw new Error("Clusters array is required");
    }

    const results = [];
    for (const item of clustersArray) {
      if (!item.code || !item.name) continue;

      let cluster = await assessmentRepository.findCareerClusterByCode(item.code);
      if (cluster) {
        cluster = await assessmentRepository.updateCareerCluster(cluster.id, {
          name: item.name,
          hollandCode: item.hollandCode || null,
          description: item.description || null
        });
      } else {
        cluster = await assessmentRepository.createCareerCluster({
          code: item.code,
          name: item.name,
          hollandCode: item.hollandCode || null,
          description: item.description || null
        });
      }

      if (item.weights && typeof item.weights === "object") {
        const weightsList = Array.isArray(item.weights)
          ? item.weights
          : Object.entries(item.weights).map(([facet, weight]) => ({ facet, weight }));

        for (const w of weightsList) {
          if (w.facet && w.weight !== undefined) {
            await assessmentRepository.upsertCareerClusterWeight(cluster.id, w.facet, Number(w.weight));
          }
        }
      }

      results.push(await assessmentRepository.findCareerClusterById(cluster.id));
    }

    return results;
  },

  getCareerClusterById: async (clusterId) => {
    const cluster = await assessmentRepository.findCareerClusterById(clusterId);
    if (!cluster) {
      throw new Error("Career cluster not found");
    }
    return cluster;
  },

  updateCareerCluster: async (clusterId, body) => {
    const existing = await assessmentRepository.findCareerClusterById(clusterId);
    if (!existing) {
      throw new Error("Career cluster not found");
    }

    if (body.code && body.code !== existing.code) {
      const codeConflict = await assessmentRepository.findCareerClusterByCode(body.code);
      if (codeConflict && codeConflict.id !== Number(clusterId)) {
        throw new Error(`Career cluster with code "${body.code}" already exists`);
      }
    }

    const updateData = {};
    if (body.code !== undefined) updateData.code = body.code;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.hollandCode !== undefined) updateData.hollandCode = body.hollandCode;
    if (body.description !== undefined) updateData.description = body.description;

    const updated = await assessmentRepository.updateCareerCluster(clusterId, updateData);

    // If weights are provided, upsert them
    if (body.weights && typeof body.weights === "object") {
      const weightsList = Array.isArray(body.weights)
        ? body.weights
        : Object.entries(body.weights).map(([facet, weight]) => ({ facet, weight }));

      await assessmentRepository.deleteWeightsByClusterId(clusterId);
      for (const w of weightsList) {
        if (w.facet && w.weight !== undefined) {
          await assessmentRepository.upsertCareerClusterWeight(clusterId, w.facet, Number(w.weight));
        }
      }
      return assessmentRepository.findCareerClusterById(clusterId);
    }

    return updated;
  },

  deleteCareerCluster: async (clusterId) => {
    const existing = await assessmentRepository.findCareerClusterById(clusterId);
    if (!existing) {
      throw new Error("Career cluster not found");
    }

    return assessmentRepository.deleteCareerCluster(clusterId);
  },

  createCareerClusterWeight: async (clusterId, body) => {
    const cluster = await assessmentRepository.findCareerClusterById(clusterId);
    if (!cluster) {
      throw new Error("Career cluster not found");
    }

    if (!body.facet) {
      throw new Error("Facet is required (e.g. 'R', 'I', 'Mech', 'Log', 'O', 'OC')");
    }

    if (body.weight === undefined || isNaN(Number(body.weight))) {
      throw new Error("Numeric weight value is required");
    }

    return assessmentRepository.upsertCareerClusterWeight(
      clusterId,
      body.facet,
      Number(body.weight)
    );
  },

  getWeightsByCluster: async (clusterId) => {
    const cluster = await assessmentRepository.findCareerClusterById(clusterId);
    if (!cluster) {
      throw new Error("Career cluster not found");
    }

    return assessmentRepository.findWeightsByClusterId(clusterId);
  },

  bulkUpdateClusterWeights: async (clusterId, weightsArray) => {
    if (!Array.isArray(weightsArray)) {
      throw new Error("Weights must be an array of { facet, weight }");
    }

    const cluster = await assessmentRepository.findCareerClusterById(clusterId);
    if (!cluster) {
      throw new Error("Career cluster not found");
    }

    await assessmentRepository.deleteWeightsByClusterId(clusterId);

    for (const item of weightsArray) {
      if (item.facet && item.weight !== undefined) {
        await assessmentRepository.upsertCareerClusterWeight(
          clusterId,
          item.facet,
          Number(item.weight)
        );
      }
    }

    return assessmentRepository.findWeightsByClusterId(clusterId);
  },

  updateSingleClusterWeight: async (weightId, body) => {
    const existing = await assessmentRepository.findWeightById(weightId);
    if (!existing) {
      throw new Error("Cluster weight record not found");
    }

    const updateData = {};
    if (body.facet !== undefined) updateData.facet = body.facet;
    if (body.weight !== undefined) updateData.weight = Number(body.weight);

    return assessmentRepository.updateCareerClusterWeight(weightId, updateData);
  },

  deleteSingleClusterWeight: async (weightId) => {
    const existing = await assessmentRepository.findWeightById(weightId);
    if (!existing) {
      throw new Error("Cluster weight record not found");
    }

    return assessmentRepository.deleteCareerClusterWeight(weightId);
  },


  // =========================================================
  // ADMIN: ATTEMPTS & RESULTS MANAGEMENT
  // =========================================================

  getAllAttemptsAdmin: async (query = {}) => {
    const { assessmentId, userId, status, search, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const [attempts, total] = await Promise.all([
      assessmentRepository.findAllAttempts({
        assessmentId,
        userId,
        status,
        search,
        skip,
        take: Number(limit)
      }),
      assessmentRepository.countAttempts({ assessmentId, userId, status, search })
    ]);

    return {
      attempts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  },

  getAttemptByIdAdmin: async (attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    let report = null;
    if (attempt.result) {
      const clusters = await assessmentRepository.getCareerClusters();
      const rankedClusters = calculateClusterMatches(attempt.result.scores, clusters);
      const studentName = attempt.user
        ? [attempt.user.firstName, attempt.user.lastName].filter(Boolean).join(" ") || attempt.user.username || attempt.user.email
        : null;
      const className = attempt.user?.profile?.class || null;
      const school = attempt.user?.institute?.name || null;

      report = buildAssessmentReport({
        studentName,
        className,
        school,
        scores: attempt.result.scores,
        hollandCode: attempt.result.hollandCode,
        rankedClusters,
        completedAt: attempt.completedAt || attempt.result.createdAt
      });
    }

    const studentFullName = attempt.user
      ? [attempt.user.firstName, attempt.user.lastName].filter(Boolean).join(" ") || attempt.user.username || attempt.user.email
      : null;

    return {
      ...attempt,
      studentName: studentFullName,
      className: attempt.user?.profile?.class || null,
      school: attempt.user?.institute?.name || null,
      email: attempt.user?.email || null,
      phone: attempt.user?.mobile || null,
      hollandCode: attempt.result?.hollandCode || null,
      topCareerCluster: attempt.result?.topCareerCluster || null,
      topCareerMatch: attempt.result?.topCareerMatch || null,
      scores: attempt.result?.scores || null,
      top5Clusters: attempt.result?.top5Clusters || null,
      report
    };
  },

  deleteAttemptAdmin: async (attemptId) => {
    const existing = await assessmentRepository.findAttemptById(attemptId);
    if (!existing) {
      throw new Error("Attempt not found");
    }

    return assessmentRepository.deleteAttempt(attemptId);
  },

  recalculateAttempt: async (attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    const questions = attempt.assessment.sections.flatMap((section) =>
      section.questions.map((q) => ({
        ...q,
        sectionCode: normalizeSectionCode(section.code)
      }))
    );

    const scores = calculateScores(questions, attempt.answers);
    const hollandCode = calculateHollandCode(scores);
    const clusters = await assessmentRepository.getCareerClusters();
    const rankedClusters = calculateClusterMatches(scores, clusters);

    const top5 = rankedClusters.slice(0, 5);
    const top1 = top5[0] || null;

    const resultData = {
      hollandCode,
      topCareerCluster: top1?.name || null,
      topCareerMatch: top1 ? Math.round(top1.match * 100) : null,
      scores,
      top5Clusters: top5.map((c) => ({
        clusterId: c.clusterId,
        code: c.code,
        cluster: c.name,
        hollandCode: c.hollandCode,
        match: Math.round(c.match * 100),
        fitI: Math.round(c.fitI * 100),
        fitA: Math.round(c.fitA * 100),
        fitP: Math.round(c.fitP * 100),
        fitV: Math.round(c.fitV * 100)
      }))
    };

    const existingResult = await assessmentRepository.findResultByAttemptId(attemptId);
    if (existingResult) {
      await assessmentRepository.updateResult(attemptId, resultData);
    } else {
      await assessmentRepository.createResult({
        attemptId: Number(attemptId),
        ...resultData
      });
    }

    return assessmentRepository.findResultByAttemptId(attemptId);
  },


  verifyUserAssessmentAccess: async (userId) => {
    if (!userId) {
      return { allowed: false, reason: "UNAUTHORIZED", message: "User is not authenticated" };
    }

    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        isInstituteStudent: true,
        instituteId: true
      }
    });

    if (!user) {
      return { allowed: false, reason: "USER_NOT_FOUND", message: "User not found" };
    }

    // 1. Institute students have free access
    if (canAccessAssessment(user)) {
      return {
        allowed: true,
        isInstituteStudent: true,
        message: "Access granted (Institute Student)"
      };
    }

    // 2. Count completed psychometric assessment attempts for this user
    const completedAttemptsCount = await prisma.assessmentAttempt.count({
      where: {
        userId: Number(userId),
        status: "completed"
      }
    });

    // 3. FIRST TIME RULE: 1st psychometric test attempt is completely FREE!
    if (completedAttemptsCount === 0) {
      return {
        allowed: true,
        isFreeAttempt: true,
        completedAttemptsCount: 0,
        message: "Access granted: Your 1st psychometric test attempt is FREE!"
      };
    }

    // 4. SECOND TIME & ONWARDS: User must have an active subscription containing the assessment module
    const activeSubscriptions = await prisma.subscriptions.findMany({
      where: {
        userId: Number(userId),
        status: "active",
        endDate: { gte: new Date() }
      },
      include: {
        plan: {
          include: {
            modules: true
          }
        }
      },
      orderBy: {
        startDate: "desc"
      }
    });

    const validSubscription = activeSubscriptions.find((sub) =>
      sub.plan?.modules?.some((mod) => isAssessmentModule(mod))
    );

    if (!validSubscription) {
      return {
        allowed: false,
        reason: "PLAN_REQUIRED_FOR_RETAKE",
        requiresNewPlan: true,
        completedAttemptsCount,
        message: "Aapka pehla free psychometric test complete ho chuka hai. Dobara test dene ke liye kripya assessment plan purchase karein."
      };
    }

    // 5. One completed assessment per purchased subscription rule
    // Check if user has already completed an attempt on or after the start date of this active subscription
    const completedAttempt = await prisma.assessmentAttempt.findFirst({
      where: {
        userId: Number(userId),
        status: "completed",
        completedAt: {
          gte: validSubscription.startDate
        }
      },
      orderBy: {
        completedAt: "desc"
      }
    });

    if (completedAttempt) {
      return {
        allowed: false,
        reason: "ALREADY_COMPLETED",
        requiresNewPlan: true,
        completedAttemptsCount,
        completedAttemptId: completedAttempt.id,
        completedAt: completedAttempt.completedAt,
        message: "You have already completed your assessment under your current plan. Please subscribe to a new assessment plan to retake the test."
      };
    }

    return {
      allowed: true,
      isFreeAttempt: false,
      completedAttemptsCount,
      subscriptionId: validSubscription.id,
      planTitle: validSubscription.plan?.title,
      message: "Access granted (Subscribed Plan)"
    };
  },

  getPublishedAssessments: async (userId = null) => {
    const assessments = await assessmentRepository.findAllPublishedAssessments();
    if (!userId) {
      return assessments;
    }

    const access = await assessmentService.verifyUserAssessmentAccess(userId);
    return {
      assessments,
      access
    };
  },

  getAssessment: async (assessmentId) => {
    const assessment = await assessmentRepository.findPublishedAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Published assessment not found");
    }
    return assessment;
  },

  startAttempt: async (userId, assessmentId) => {
    if (!userId) {
      throw new Error("User ID is required to start assessment");
    }

    // Access check & 1st attempt free / subscription retake enforcement
    const access = await assessmentService.verifyUserAssessmentAccess(userId);
    if (!access.allowed) {
      const err = new Error(access.message);
      err.status = 403;
      err.reason = access.reason;
      err.requiresNewPlan = Boolean(access.requiresNewPlan);
      throw err;
    }

    const assessment = await assessmentRepository.findPublishedAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Published assessment not found");
    }

    // Check if an in_progress attempt already exists to allow resuming
    const existingInProgress = await prisma.assessmentAttempt.findFirst({
      where: {
        userId: Number(userId),
        assessmentId: Number(assessmentId),
        status: "in_progress"
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (existingInProgress) {
      return {
        attemptId: existingInProgress.id,
        assessmentId: existingInProgress.assessmentId,
        status: existingInProgress.status,
        startedAt: existingInProgress.startedAt,
        isResumed: true,
        isFreeAttempt: Boolean(access.isFreeAttempt)
      };
    }

    const attempt = await assessmentRepository.createAttempt({
      assessmentId: Number(assessmentId),
      userId: Number(userId),
      status: "in_progress"
    });

    return {
      attemptId: attempt.id,
      assessmentId: attempt.assessmentId,
      status: attempt.status,
      startedAt: attempt.startedAt,
      isFreeAttempt: Boolean(access.isFreeAttempt)
    };
  },

  getAttemptStatus: async (userId, attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not authorized to view this attempt");
    }

    const totalQuestions = attempt.assessment.sections.reduce(
      (count, s) => count + s.questions.length,
      0
    );
    const answeredQuestions = attempt.answers.length;

    return {
      attemptId: attempt.id,
      assessmentId: attempt.assessmentId,
      assessmentTitle: attempt.assessment.title,
      status: attempt.status,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      totalQuestions,
      answeredQuestions,
      progressPercentage: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
      hasResult: Boolean(attempt.result)
    };
  },

  getAttemptQuestions: async (userId, attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not allowed to access this attempt");
    }

    // Map existing answers for convenience so frontend can prefill
    const answersMap = {};
    for (const a of attempt.answers) {
      answersMap[a.questionId] = {
        selectedOptionId: a.selectedOptionId,
        likertValue: a.likertValue
      };
    }

    const sectionsWithAnswers = attempt.assessment.sections.map((section) => ({
      ...section,
      questions: section.questions.map((q) => ({
        ...q,
        userAnswer: answersMap[q.id] || null
      }))
    }));

    return {
      attemptId: attempt.id,
      assessmentId: attempt.assessmentId,
      status: attempt.status,
      sections: sectionsWithAnswers
    };
  },

  getMyAttempts: async (userId) => {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return assessmentRepository.findAttemptsByUserId(userId);
  },

  saveAnswer: async (userId, attemptId, body) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not allowed to answer this attempt");
    }

    if (attempt.status !== "in_progress") {
      throw new Error("Attempt is already completed or inactive");
    }

    const question = await assessmentRepository.findQuestionById(body.questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    if (question.section.assessmentId !== attempt.assessmentId) {
      throw new Error("Question does not belong to this assessment");
    }

    // 1. Likert Question
    if (question.type === "likert5") {
      const value = Number(body.likertValue);
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        throw new Error("Likert value must be an integer between 1 and 5");
      }

      return assessmentRepository.upsertAnswer({
        attemptId: Number(attemptId),
        questionId: question.id,
        likertValue: value,
        selectedOptionId: null
      });
    }

    // 2. MCQ Question
    if (!body.selectedOptionId) {
      throw new Error("selectedOptionId is required for MCQ questions");
    }

    const selectedOption = question.options.find(
      (opt) => Number(opt.id) === Number(body.selectedOptionId)
    );

    if (!selectedOption) {
      throw new Error("Invalid option selected for this question");
    }

    return assessmentRepository.upsertAnswer({
      attemptId: Number(attemptId),
      questionId: question.id,
      selectedOptionId: selectedOption.id,
      likertValue: null
    });
  },

  saveBatchAnswers: async (userId, attemptId, answersArray) => {
    if (!Array.isArray(answersArray) || !answersArray.length) {
      throw new Error("Answers array is required");
    }

    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not allowed to answer this attempt");
    }

    if (attempt.status !== "in_progress") {
      throw new Error("Attempt is already completed or inactive");
    }

    const saved = [];
    for (const ans of answersArray) {
      if (!ans.questionId) continue;
      const question = await assessmentRepository.findQuestionById(ans.questionId);
      if (!question || question.section.assessmentId !== attempt.assessmentId) continue;

      if (question.type === "likert5" && ans.likertValue !== undefined && ans.likertValue !== null) {
        const value = Number(ans.likertValue);
        if (Number.isInteger(value) && value >= 1 && value <= 5) {
          const res = await assessmentRepository.upsertAnswer({
            attemptId: Number(attemptId),
            questionId: question.id,
            likertValue: value,
            selectedOptionId: null
          });
          saved.push(res);
        }
      } else if (ans.selectedOptionId) {
        const option = question.options.find((o) => Number(o.id) === Number(ans.selectedOptionId));
        if (option) {
          const res = await assessmentRepository.upsertAnswer({
            attemptId: Number(attemptId),
            questionId: question.id,
            selectedOptionId: option.id,
            likertValue: null
          });
          saved.push(res);
        }
      }
    }

    return {
      savedCount: saved.length,
      totalReceived: answersArray.length
    };
  },

  submitAttempt: async (userId, attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not allowed to submit this attempt");
    }

    // If already completed, return existing report
    if (attempt.status === "completed" && attempt.result) {
      return assessmentService.getResult(userId, attemptId);
    }

    // Attach section metadata onto question objects
    const questions = attempt.assessment.sections.flatMap((section) =>
      section.questions.map((q) => ({
        ...q,
        sectionCode: normalizeSectionCode(section.code),
        sectionTitle: section.title
      }))
    );

    // Verify all mandatory questions are answered
    // Note: Aptitude section has a 15-minute timer on the frontend UI, so answering every aptitude question is NOT mandatory.
    // Unanswered/skipped aptitude questions will automatically be scored as 0 (incorrect) in aptitude calculation.
    const answeredQuestionIds = new Set(
      attempt.answers.map((a) => Number(a.questionId))
    );

    const unanswered = questions.filter((q) => {
      const isAptitude = q.sectionCode === "aptitude";
      if (isAptitude) return false; // Non-mandatory for timed aptitude section
      return !answeredQuestionIds.has(Number(q.id));
    });

    if (unanswered.length > 0) {
      throw new Error(
        `Please answer all required questions before submitting. Unanswered count: ${unanswered.length}`
      );
    }

    // 1. Calculate scores across all domains
    const scores = calculateScores(questions, attempt.answers);

    // 2. Calculate Holland code (RIASEC top 3)
    const hollandCode = calculateHollandCode(scores);

    // 3. Fetch Career Clusters and compute weighted matches
    const clusters = await assessmentRepository.getCareerClusters();
    const rankedClusters = calculateClusterMatches(scores, clusters);

    const top5 = rankedClusters.slice(0, 5);
    const top1 = top5[0] || null;

    const top5ClustersJson = top5.map((c) => ({
      clusterId: c.clusterId,
      code: c.code,
      cluster: c.name,
      hollandCode: c.hollandCode,
      match: Math.round(c.match * 100),
      fitI: Math.round(c.fitI * 100),
      fitA: Math.round(c.fitA * 100),
      fitP: Math.round(c.fitP * 100),
      fitV: Math.round(c.fitV * 100),
      careers: c.careers || []
    }));

    // Save Assessment Result in DB
    const existingResult = await assessmentRepository.findResultByAttemptId(attemptId);
    let resultRecord;

    const resultPayload = {
      hollandCode,
      topCareerCluster: top1?.name || null,
      topCareerMatch: top1 ? Math.round(top1.match * 100) : null,
      scores,
      top5Clusters: top5ClustersJson
    };

    if (existingResult) {
      resultRecord = await assessmentRepository.updateResult(attemptId, resultPayload);
    } else {
      resultRecord = await assessmentRepository.createResult({
        attemptId: Number(attemptId),
        ...resultPayload
      });
    }

    // Mark attempt completed
    await assessmentRepository.completeAttempt(attemptId);

    // Fetch updated attempt to ensure completedAt and user details are fresh
    const updatedAttempt = await assessmentRepository.findAttemptById(attemptId);

    const studentName = updatedAttempt?.user
      ? [updatedAttempt.user.firstName, updatedAttempt.user.lastName].filter(Boolean).join(" ") || updatedAttempt.user.username || updatedAttempt.user.email
      : null;
    const className = updatedAttempt?.user?.profile?.class || null;
    const school = updatedAttempt?.user?.institute?.name || null;

    // Build rich formatted report matching Career Compass report structure
    const fullReport = buildAssessmentReport({
      studentName,
      className,
      school,
      scores,
      hollandCode,
      rankedClusters,
      completedAt: updatedAttempt?.completedAt || new Date()
    });

    // Automatically send report email with direct link
    try {
      const recipientEmail = updatedAttempt?.user?.email;
      if (recipientEmail) {
        await sendReportEmail({
          toEmail: recipientEmail,
          studentName: studentName,
          attemptId: Number(attemptId),
          assessmentTitle: attempt.assessment?.title || "Career Compass Psychometric Assessment",
          hollandCode: resultRecord.hollandCode,
          topCluster: resultRecord.topCareerCluster,
          topMatch: resultRecord.topCareerMatch
        });
      }
    } catch (emailErr) {
      console.error("❌ Failed to send assessment report email:", emailErr.message);
    }

    return {
      resultId: resultRecord.id,
      attemptId: Number(attemptId),
      assessmentId: attempt.assessmentId,
      assessmentTitle: attempt.assessment.title,
      user: updatedAttempt?.user ? {
        id: updatedAttempt.user.id,
        name: studentName,
        firstName: updatedAttempt.user.firstName,
        lastName: updatedAttempt.user.lastName,
        username: updatedAttempt.user.username,
        email: updatedAttempt.user.email,
        mobile: updatedAttempt.user.mobile,
        class: className,
        school: school
      } : null,
      hollandCode: resultRecord.hollandCode,
      topCareerCluster: resultRecord.topCareerCluster,
      topCareerMatch: resultRecord.topCareerMatch,
      scores: resultRecord.scores,
      top5Clusters: resultRecord.top5Clusters,
      report: fullReport
    };
  },

  getResult: async (userId, attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not allowed to access this result");
    }

    const result = await assessmentRepository.findResultByAttemptId(attemptId);
    if (!result) {
      throw new Error("Result has not been generated for this attempt yet");
    }

    const clusters = await assessmentRepository.getCareerClusters();
    const rankedClusters = calculateClusterMatches(result.scores, clusters);

    const studentName = attempt.user
      ? [attempt.user.firstName, attempt.user.lastName].filter(Boolean).join(" ") || attempt.user.username || attempt.user.email
      : null;
    const className = attempt.user?.profile?.class || null;
    const school = attempt.user?.institute?.name || null;

    const fullReport = buildAssessmentReport({
      studentName,
      className,
      school,
      scores: result.scores,
      hollandCode: result.hollandCode,
      rankedClusters,
      completedAt: attempt.completedAt || result.createdAt
    });

    return {
      resultId: result.id,
      attemptId: result.attemptId,
      assessmentId: attempt.assessmentId,
      assessmentTitle: attempt.assessment.title,
      status: attempt.status,
      completedAt: attempt.completedAt,
      user: attempt.user ? {
        id: attempt.user.id,
        name: studentName,
        firstName: attempt.user.firstName,
        lastName: attempt.user.lastName,
        username: attempt.user.username,
        email: attempt.user.email,
        mobile: attempt.user.mobile,
        class: className,
        school: school
      } : null,
      hollandCode: result.hollandCode,
      topCareerCluster: result.topCareerCluster,
      topCareerMatch: result.topCareerMatch,
      scores: result.scores,
      top5Clusters: result.top5Clusters,
      report: fullReport
    };
  },

  // =========================================================
  // CAREER PLANNING TRACK / PERSONAL PROFILING (CRI)
  // =========================================================

  getProfilingQuestions: async () => {
    return {
      title: "Career Planning Track / Personal Profiling",
      purpose: "Places each student on a 5-stage career-planning track (Unaware → Confused → Exploring → Clarity → Future-Ready), shows a risk level, and gives a simple action plan.",
      totalQuestions: PROFILING_QUESTIONS.length,
      domains: PROFILING_DOMAINS,
      stageBands: STAGE_BANDS,
      likertScale: LIKERT_RESPONSE_SCALE,
      selfPlacementOptions: SELF_PLACEMENT_OPTIONS,
      questions: PROFILING_QUESTIONS
    };
  },

  calculateProfilingLive: async (answers, options = {}) => {
    if (!answers) {
      throw new Error("Answers payload is required");
    }
    const result = calculateProfiling(answers, options);
    if (!result.isComplete) {
      const err = new Error(result.message);
      err.missingItems = result.missingItems;
      err.status = 400;
      throw err;
    }
    return result;
  },

  getProfilingTestCases: async () => {
    const validation = validateProfilingAgainstTestCases();
    return {
      validationSummary: {
        allPassed: validation.allPassed,
        totalCases: validation.totalCases,
        passedCases: validation.passedCases,
        failedCases: validation.failedCases
      },
      testCases: TEST_CASES.map((tc, idx) => ({
        ...tc,
        computed: validation.results[idx]
      }))
    };
  },

  // =========================================================
  // SEND / RESEND REPORT EMAIL
  // =========================================================
  sendAttemptReportEmail: async (userId, attemptId, customEmail = null) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Assessment attempt not found");
    }

    if (userId && Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not allowed to send email for this assessment attempt");
    }

    const result = await assessmentRepository.findResultByAttemptId(attemptId);
    if (!result) {
      throw new Error("Result has not been generated for this attempt yet");
    }

    const studentName = attempt.user
      ? [attempt.user.firstName, attempt.user.lastName].filter(Boolean).join(" ") || attempt.user.username || attempt.user.email
      : "Student";

    const targetEmail = customEmail || attempt.user?.email;
    if (!targetEmail) {
      throw new Error("No recipient email address found for this user");
    }

    await sendReportEmail({
      toEmail: targetEmail,
      studentName: studentName,
      attemptId: Number(attemptId),
      assessmentTitle: attempt.assessment?.title || "Career Compass Psychometric Assessment",
      hollandCode: result.hollandCode,
      topCluster: result.topCareerCluster,
      topMatch: result.topCareerMatch
    });

    return {
      success: true,
      message: `Assessment report link successfully sent to ${targetEmail}`
    };
  }

};