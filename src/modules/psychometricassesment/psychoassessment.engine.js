import {
  calculateProfiling
} from "./profiling.engine.js";
import {
  CLUSTER_CAREERS
} from "./psychoassessment.seed.js";

// ============================================================
// ASSESSMENT SCORING ENGINE
// ============================================================

export const INTEREST_FACETS = [
  "R",
  "I",
  "A",
  "S",
  "E",
  "C"
];

export const PERSONALITY_FACETS = [
  "O",
  "Cn",
  "Ex",
  "Ag",
  "ES"
];

export const VALUE_FACETS = [
  "OC",
  "SE",
  "CO",
  "ST"
];

export const VARK_FACETS = [
  "V",
  "A",
  "Rd",
  "K"
];

export const GOAL_FACETS = [
  "L",
  "S"
];

export const APTITUDE_FACETS = [
  "Mech",
  "Log",
  "Verb",
  "Spat",
  "Num",
  "Voc"
];

// Facet Metadata Definitions by Domain
export const INTEREST_FACET_DEFINITIONS = {
  R: { name: "Realistic", domain: "interest", description: "Hands-on, practical, mechanical, tools, physical activities" },
  I: { name: "Investigative", domain: "interest", description: "Analytical, intellectual, scientific, research, problem solving" },
  A: { name: "Artistic", domain: "interest", description: "Creative, expressive, original, design, music, writing" },
  S: { name: "Social", domain: "interest", description: "Helping, teaching, counseling, collaborating, community service" },
  E: { name: "Enterprising", domain: "interest", description: "Leadership, persuasion, business, entrepreneurship, initiative" },
  C: { name: "Conventional", domain: "interest", description: "Organized, detail-oriented, systematic, data management, precision" }
};

export const PERSONALITY_FACET_DEFINITIONS = {
  O: { name: "Openness", domain: "personality", description: "Curiosity, imagination, appreciation for new ideas and variety" },
  Cn: { name: "Conscientiousness", domain: "personality", description: "Organization, discipline, goal-directed behavior, reliability" },
  Ex: { name: "Extraversion", domain: "personality", description: "Sociability, energy, assertiveness, enthusiasm" },
  Ag: { name: "Agreeableness", domain: "personality", description: "Empathy, cooperation, trust, altruism, teamwork" },
  ES: { name: "Emotional Stability", domain: "personality", description: "Resilience, calm under pressure, emotional balance" }
};

export const VALUE_FACET_DEFINITIONS = {
  OC: { name: "Openness to Change", domain: "values", description: "Autonomy, variety, stimulation, innovation in work" },
  SE: { name: "Self-Enhancement", domain: "values", description: "Achievement, influence, financial growth, social recognition" },
  CO: { name: "Conservation", domain: "values", description: "Security, stability, tradition, structure, predictability" },
  ST: { name: "Self-Transcendence", domain: "values", description: "Helping others, societal impact, benevolence, sustainability" }
};

export const VARK_FACET_DEFINITIONS = {
  V: { name: "Visual", domain: "learning_style", description: "Diagrams, charts, maps, visual demonstrations" },
  A: { name: "Auditory", domain: "learning_style", description: "Discussions, lectures, spoken explanations, listening" },
  Rd: { name: "Read/Write", domain: "learning_style", description: "Textbooks, articles, writing notes, lists" },
  K: { name: "Kinesthetic", domain: "learning_style", description: "Hands-on practice, experiments, physical engagement" }
};

export const GOAL_FACET_DEFINITIONS = {
  L: { name: "Long-term Orientation", domain: "goal_orientation", description: "Strategic planning, patience, multi-year milestones" },
  S: { name: "Short-term Orientation", domain: "goal_orientation", description: "Quick wins, immediate execution, agile milestones" }
};

export const APTITUDE_FACET_DEFINITIONS = {
  Mech: { name: "Mechanical Reasoning", domain: "aptitude", description: "Understanding mechanical principles, physics, practical mechanisms" },
  Log: { name: "Logical Reasoning", domain: "aptitude", description: "Pattern recognition, deductive and inductive problem solving" },
  Verb: { name: "Verbal Ability", domain: "aptitude", description: "Comprehension, communication, text analysis" },
  Spat: { name: "Spatial Ability", domain: "aptitude", description: "3D visualization, mental rotation, spatial relations" },
  Num: { name: "Numerical Ability", domain: "aptitude", description: "Quantitative problem solving, mathematical reasoning, data" },
  Voc: { name: "Vocabulary", domain: "aptitude", description: "Vocabulary mastery, language comprehension, and grammar" }
};

// Global merged facet definitions fallback (RIASEC takes priority for A and S)
export const FACET_DEFINITIONS = {
  ...INTEREST_FACET_DEFINITIONS,
  ...PERSONALITY_FACET_DEFINITIONS,
  ...VALUE_FACET_DEFINITIONS,
  ...APTITUDE_FACET_DEFINITIONS
};

export const getFacetDefinition = (domain, facet) => {
  const normDomain = normalizeSectionCode(domain);
  if (normDomain === "interest") return INTEREST_FACET_DEFINITIONS[facet];
  if (normDomain === "personality") return PERSONALITY_FACET_DEFINITIONS[facet];
  if (normDomain === "values") return VALUE_FACET_DEFINITIONS[facet];
  if (normDomain === "learning_style" || normDomain === "vark") return VARK_FACET_DEFINITIONS[facet];
  if (normDomain === "goal_orientation" || normDomain === "goals") return GOAL_FACET_DEFINITIONS[facet];
  if (normDomain === "aptitude") return APTITUDE_FACET_DEFINITIONS[facet];
  return FACET_DEFINITIONS[facet] || null;
};

// ============================================================
// HELPERS
// ============================================================

export const normalizeSectionCode = (code) => {
  if (!code) return "";
  const cleaned = String(code).toLowerCase().trim();
  if (cleaned === "profiling" || cleaned === "personal_profiling" || cleaned === "career_planning" || cleaned === "profile" || cleaned === "cri" || cleaned === "career_readiness") return "profiling";
  if (cleaned === "interests" || cleaned === "interest") return "interest";
  if (cleaned === "personalities" || cleaned === "personality") return "personality";
  if (cleaned === "value" || cleaned === "values" || cleaned === "work_values") return "values";
  if (cleaned === "vark" || cleaned === "learning_style" || cleaned === "learning_styles" || cleaned === "learning") return "learning_style";
  if (cleaned === "goals" || cleaned === "goal_orientation" || cleaned === "goal") return "goal_orientation";
  if (cleaned === "aptitudes" || cleaned === "aptitude") return "aptitude";
  return cleaned;
};

export const reverseLikertValue = (reverse, value) => {
  const numericVal = Number(value);
  if (reverse) {
    return 6 - numericVal;
  }
  return numericVal;
};

export const normalizeLikertMean = (mean) => {
  if (mean === null || mean === undefined || isNaN(mean)) return 0;
  // Likert scale 1 to 5 mapped to 0.0 - 1.0 (0% - 100%)
  const clamped = Math.max(1, Math.min(5, Number(mean)));
  return (clamped - 1) / 4;
};

export const getScoreBand = (score0To1) => {
  const score = Number(score0To1 || 0);
  if (score < 0.35) return { band: "developing", label: "Developing" };
  if (score <= 0.70) return { band: "moderate", label: "Moderate" };
  return { band: "high", label: "High" };
};

// ============================================================
// LIKERT FACET SCORING
// ============================================================

export const calculateLikertFacet = (questions, answers, targetSectionCode, targetFacet) => {
  const normalizedTargetSection = normalizeSectionCode(targetSectionCode);

  const facetQuestions = questions.filter((q) => {
    const qSectionCode = normalizeSectionCode(q.sectionCode || q.section?.code);
    return qSectionCode === normalizedTargetSection && q.facet === targetFacet;
  });

  if (!facetQuestions.length) {
    return 0;
  }

  const values = [];

  for (const question of facetQuestions) {
    const answer = answers.find((a) => Number(a.questionId) === Number(question.id));

    if (!answer || answer.likertValue === null || answer.likertValue === undefined) {
      continue;
    }

    const value = reverseLikertValue(Boolean(question.reverse), Number(answer.likertValue));
    values.push(value);
  }

  if (!values.length) {
    return 0;
  }

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  return normalizeLikertMean(mean);
};

// ============================================================
// APTITUDE (MCQ) FACET SCORING
// ============================================================

export const calculateAptitudeFacet = (questions, answers, targetFacet) => {
  const facetQuestions = questions.filter((q) => {
    const qSectionCode = normalizeSectionCode(q.sectionCode || q.section?.code);
    return qSectionCode === "aptitude" && q.facet === targetFacet;
  });

  if (!facetQuestions.length) {
    return 0;
  }

  let correctCount = 0;
  let answeredCount = 0;

  for (const question of facetQuestions) {
    const answer = answers.find((a) => Number(a.questionId) === Number(question.id));

    if (!answer || !answer.selectedOptionId) {
      continue;
    }

    answeredCount++;

    // Check if selected option is correct either from question.options or answer.selectedOption
    let isCorrect = false;

    if (answer.selectedOption && typeof answer.selectedOption.isCorrect === "boolean") {
      isCorrect = answer.selectedOption.isCorrect;
    } else if (Array.isArray(question.options)) {
      const selectedOption = question.options.find(
        (opt) => Number(opt.id) === Number(answer.selectedOptionId)
      );
      if (selectedOption) {
        isCorrect = Boolean(selectedOption.isCorrect);
      }
    }

    if (isCorrect) {
      correctCount++;
    }
  }

  return correctCount / facetQuestions.length;
};

// ============================================================
// COMPLETE SCORE CALCULATION
// ============================================================

export const calculateScores = (questions, answers) => {
  const scores = {};

  // Normalize questions to ensure sectionCode is accessible
  const normalizedQuestions = questions.map((q) => ({
    ...q,
    sectionCode: normalizeSectionCode(q.sectionCode || q.section?.code)
  }));

  // 0. Profiling (Career Planning Track / CRI)
  const profilingQuestions = normalizedQuestions.filter((q) => q.sectionCode === "profiling");
  if (profilingQuestions.length > 0) {
    const profilingAnswers = [];
    for (const q of profilingQuestions) {
      const ans = answers.find((a) => Number(a.questionId) === Number(q.id));
      if (ans) {
        if (ans.likertValue !== null && ans.likertValue !== undefined) {
          profilingAnswers.push({ itemId: q.itemId, value: Number(ans.likertValue) });
        } else if (ans.selectedOptionId || ans.selectedOption) {
          const opt = q.options?.find((o) => Number(o.id) === Number(ans.selectedOptionId)) || ans.selectedOption;
          const optText = opt?.optionText || String(ans.selectedOptionId);
          profilingAnswers.push({ itemId: q.itemId, value: optText });
        }
      }
    }
    const profResult = calculateProfiling(profilingAnswers);
    if (profResult.isComplete) {
      scores.profiling = profResult;
    }
  }

  // 1. Interest (RIASEC)
  for (const facet of INTEREST_FACETS) {
    scores[facet] = calculateLikertFacet(normalizedQuestions, answers, "interest", facet);
  }

  // 2. Big Five Personality
  for (const facet of PERSONALITY_FACETS) {
    scores[facet] = calculateLikertFacet(normalizedQuestions, answers, "personality", facet);
  }

  // 3. Work Values
  for (const facet of VALUE_FACETS) {
    scores[facet] = calculateLikertFacet(normalizedQuestions, answers, "values", facet);
  }

  // 4. VARK Learning Styles
  scores.vark = {};
  for (const facet of VARK_FACETS) {
    scores.vark[facet] = calculateLikertFacet(normalizedQuestions, answers, "learning_style", facet);
  }

  // 5. Goal Orientation
  scores.goalLong = calculateLikertFacet(normalizedQuestions, answers, "goal_orientation", "L");
  scores.goalShort = calculateLikertFacet(normalizedQuestions, answers, "goal_orientation", "S");

  // 6. Aptitude (MCQ)
  for (const facet of APTITUDE_FACETS) {
    scores[facet] = calculateAptitudeFacet(normalizedQuestions, answers, facet);
  }

  return scores;
};

// ============================================================
// HOLLAND CODE
// ============================================================

export const calculateHollandCode = (scores) => {
  return INTEREST_FACETS
    .map((facet) => ({
      facet,
      score: Number(scores[facet] || 0)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.facet)
    .join("");
};

// ============================================================
// WEIGHTED COMPONENT CALCULATION
// ============================================================

const weightedComponent = (weights, scores, facets) => {
  let numerator = 0;
  let denominator = 0;

  for (const facet of facets) {
    const weight = Number(weights[facet] || 0);
    const score = Number(scores[facet] || 0);

    if (weight > 0) {
      numerator += weight * score;
      denominator += weight;
    }
  }

  if (denominator === 0) {
    return null; // indicates no active weights defined for this domain
  }

  return numerator / denominator;
};

// ============================================================
// CAREER CLUSTER MATCH CALCULATION
// ============================================================

export const calculateClusterMatches = (scores, clusters) => {
  if (!Array.isArray(clusters) || !clusters.length) {
    return [];
  }

  const results = clusters.map((cluster) => {
    const weights = {};

    if (Array.isArray(cluster.weights)) {
      for (const w of cluster.weights) {
        weights[w.facet] = Number(w.weight);
      }
    } else if (cluster.weights && typeof cluster.weights === "object") {
      for (const [k, v] of Object.entries(cluster.weights)) {
        weights[k] = Number(v);
      }
    }

    const fitI = weightedComponent(weights, scores, INTEREST_FACETS);
    const fitA = weightedComponent(weights, scores, APTITUDE_FACETS);
    const fitP = weightedComponent(weights, scores, PERSONALITY_FACETS);
    const fitV = weightedComponent(weights, scores, VALUE_FACETS);

    // Dynamic weight balancing based on domains that have weights defined:
    // Base standard weights: Interest = 35%, Aptitude = 30%, Personality = 20%, Values = 15%
    let totalScore = 0;
    let totalDomainWeight = 0;

    const domainWeights = [
      { fit: fitI, baseWeight: 0.35 },
      { fit: fitA, baseWeight: 0.30 },
      { fit: fitP, baseWeight: 0.20 },
      { fit: fitV, baseWeight: 0.15 }
    ];

    for (const d of domainWeights) {
      if (d.fit !== null) {
        totalScore += d.fit * d.baseWeight;
        totalDomainWeight += d.baseWeight;
      }
    }

    // Normalize match percentage
    const match = totalDomainWeight > 0 ? (totalScore / totalDomainWeight) : 0;

    return {
      clusterId: cluster.id,
      code: cluster.code,
      name: cluster.name,
      hollandCode: cluster.hollandCode || null,
      description: cluster.description || null,
      careers: cluster.careers || CLUSTER_CAREERS[cluster.code] || [],
      match: Math.max(0, Math.min(1, match)),
      fitI: fitI !== null ? Math.max(0, Math.min(1, fitI)) : 0,
      fitA: fitA !== null ? Math.max(0, Math.min(1, fitA)) : 0,
      fitP: fitP !== null ? Math.max(0, Math.min(1, fitP)) : 0,
      fitV: fitV !== null ? Math.max(0, Math.min(1, fitV)) : 0
    };
  });

  return results.sort((a, b) => b.match - a.match);
};

// ============================================================
// REPORT BUILDER
// ============================================================

export const buildAssessmentReport = ({
  studentName,
  className,
  school,
  scores,
  hollandCode,
  rankedClusters,
  completedAt
}) => {
  const top5 = (rankedClusters || []).slice(0, 5);
  const top1 = top5[0] || null;

  // RIASEC breakdown
  const interestScores = INTEREST_FACETS.map((facet) => {
    const raw = Number(scores[facet] || 0);
    const pct = Math.round(raw * 100);
    const def = INTEREST_FACET_DEFINITIONS[facet];
    return {
      facet,
      name: def?.name || facet,
      score: raw,
      percentage: pct,
      band: getScoreBand(raw).band,
      bandLabel: getScoreBand(raw).label,
      description: def?.description || ""
    };
  });

  // Personality breakdown
  const personalityScores = PERSONALITY_FACETS.map((facet) => {
    const raw = Number(scores[facet] || 0);
    const pct = Math.round(raw * 100);
    const def = PERSONALITY_FACET_DEFINITIONS[facet];
    return {
      facet,
      name: def?.name || facet,
      score: raw,
      percentage: pct,
      band: getScoreBand(raw).band,
      bandLabel: getScoreBand(raw).label,
      description: def?.description || ""
    };
  });

  // Work values breakdown
  const valueScores = VALUE_FACETS.map((facet) => {
    const raw = Number(scores[facet] || 0);
    const pct = Math.round(raw * 100);
    const def = VALUE_FACET_DEFINITIONS[facet];
    return {
      facet,
      name: def?.name || facet,
      score: raw,
      percentage: pct,
      band: getScoreBand(raw).band,
      bandLabel: getScoreBand(raw).label,
      description: def?.description || ""
    };
  });

  // VARK learning styles breakdown
  const varkScores = VARK_FACETS.map((facet) => {
    const raw = Number(scores.vark?.[facet] || 0);
    const pct = Math.round(raw * 100);
    const def = VARK_FACET_DEFINITIONS[facet];
    return {
      facet,
      name: def?.name || facet,
      score: raw,
      percentage: pct,
      band: getScoreBand(raw).band,
      bandLabel: getScoreBand(raw).label,
      description: def?.description || ""
    };
  });

  // Aptitudes breakdown
  const aptitudeScores = APTITUDE_FACETS.map((facet) => {
    const raw = Number(scores[facet] || 0);
    const pct = Math.round(raw * 100);
    const def = APTITUDE_FACET_DEFINITIONS[facet];
    return {
      facet,
      name: def?.name || facet,
      score: raw,
      percentage: pct,
      band: getScoreBand(raw).band,
      bandLabel: getScoreBand(raw).label,
      description: def?.description || ""
    };
  });

  // Top Holland traits
  const primaryHolland = (hollandCode || "").split("").map((letter) => ({
    code: letter,
    name: INTEREST_FACET_DEFINITIONS[letter]?.name || letter,
    score: Math.round((Number(scores[letter]) || 0) * 100)
  }));

  return {
    student: {
      name: studentName || null,
      class: className || null,
      school: school || null,
      completedAt: completedAt || new Date()
    },
    yourProfiling: scores.profiling?.report || null,
    hollandProfile: {
      code: hollandCode || "",
      traits: primaryHolland
    },
    careerClusters: {
      topCluster: top1 ? {
        clusterId: top1.clusterId,
        code: top1.code,
        name: top1.name,
        hollandCode: top1.hollandCode,
        matchPercentage: Math.round(top1.match * 100),
        fitI: Math.round(top1.fitI * 100),
        fitA: Math.round(top1.fitA * 100),
        fitP: Math.round(top1.fitP * 100),
        fitV: Math.round(top1.fitV * 100),
        description: top1.description || "",
        careers: top1.careers || CLUSTER_CAREERS[top1.code] || []
      } : null,
      top5: top5.map((c) => ({
        clusterId: c.clusterId,
        code: c.code,
        name: c.name,
        hollandCode: c.hollandCode,
        matchPercentage: Math.round(c.match * 100),
        fitI: Math.round(c.fitI * 100),
        fitA: Math.round(c.fitA * 100),
        fitP: Math.round(c.fitP * 100),
        fitV: Math.round(c.fitV * 100),
        description: c.description || "",
        careers: c.careers || CLUSTER_CAREERS[c.code] || []
      })),
      allRanked: (rankedClusters || []).map((c) => ({
        clusterId: c.clusterId,
        code: c.code,
        name: c.name,
        hollandCode: c.hollandCode,
        matchPercentage: Math.round(c.match * 100),
        careers: c.careers || CLUSTER_CAREERS[c.code] || []
      }))
    },
    domains: {
      interests: interestScores,
      personality: personalityScores,
      values: valueScores,
      learningStyles: varkScores,
      aptitudes: aptitudeScores,
      goalOrientation: {
        longTerm: {
          score: Number(scores.goalLong || 0),
          percentage: Math.round((Number(scores.goalLong) || 0) * 100),
          band: getScoreBand(scores.goalLong).band,
          bandLabel: getScoreBand(scores.goalLong).label
        },
        shortTerm: {
          score: Number(scores.goalShort || 0),
          percentage: Math.round((Number(scores.goalShort) || 0) * 100),
          band: getScoreBand(scores.goalShort).band,
          bandLabel: getScoreBand(scores.goalShort).label
        }
      }
    }
  };
};