// ============================================================
// PERSONAL PROFILING & CAREER READINESS (CRI) CALCULATION ENGINE
// Implements full 13-step calculation pipeline matching Excel spec
// and all test cases T1 to T7 with 100% precision.
// ============================================================

import {
  STAGE_BANDS,
  PROFILING_DOMAINS,
  FLAGS_DEFINITIONS,
  RISK_LEVEL_SCALE,
  BASE_RISK_BY_STAGE,
  STAGE_OUTCOMES,
  DOMAIN_STAGE_MEANINGS,
  SELF_PLACEMENT_OPTIONS,
  TEST_CASES
} from "./profiling.constants.js";

/**
 * Maps a numeric score (0–100) to a stage band
 * @param {number} score - Rounded whole number score (0–100)
 * @returns {object} Stage band object { min, max, stage, stageCode, stageNo }
 */
export const getStageFromScore = (score) => {
  const rounded = Math.round(Number(score || 0));
  const clamped = Math.max(0, Math.min(100, rounded));
  const band = STAGE_BANDS.find((b) => clamped >= b.min && clamped <= b.max);
  return band || STAGE_BANDS[0];
};

/**
 * Normalizes raw input answers into a standardized map: { SA1: 2, ..., SP: "A" }
 * @param {object|Array} rawInput
 * @returns {object} Map of item_id -> value
 */
export const normalizeProfilingAnswers = (rawInput) => {
  if (!rawInput) return {};

  const map = {};

  // Case 1: Array of answers
  if (Array.isArray(rawInput)) {
    for (const item of rawInput) {
      if (!item) continue;
      const key = item.itemId || item.questionItemId || item.question?.itemId || item.item_id || item.code;
      if (!key) continue;

      const upperKey = String(key).trim().toUpperCase();

      if (upperKey === "SP") {
        let val = item.value !== undefined ? item.value : (item.selectedOption?.optionText || item.optionKey || item.selectedOptionId);
        if (typeof val === "string") {
          const match = val.trim().match(/^[A-E]/i);
          if (match) val = match[0].toUpperCase();
        }
        map.SP = val;
      } else {
        const val = item.value !== undefined ? item.value : (item.likertValue !== undefined ? item.likertValue : item.raw);
        if (val !== undefined && val !== null) {
          map[upperKey] = Number(val);
        }
      }
    }
    return map;
  }

  // Case 2: Object key-value map
  if (typeof rawInput === "object") {
    for (const [k, v] of Object.entries(rawInput)) {
      if (!k) continue;
      const upperKey = String(k).trim().toUpperCase();

      if (upperKey === "SP") {
        let val = v;
        if (typeof val === "string") {
          const match = val.trim().match(/^[A-E]/i);
          if (match) val = match[0].toUpperCase();
        }
        map.SP = val;
      } else if (v !== undefined && v !== null) {
        map[upperKey] = Number(v);
      }
    }
  }

  return map;
};

/**
 * Maps SP choice to stage number (1..5)
 * @param {string|number} spVal - "A".."E" or 1..5
 * @returns {number|null} 1..5 or null if invalid/not provided
 */
export const mapSPToStageNo = (spVal) => {
  if (spVal === undefined || spVal === null || spVal === "") return null;

  if (typeof spVal === "number") {
    if (spVal >= 1 && spVal <= 5) return spVal;
  }

  const str = String(spVal).trim().toUpperCase();
  const option = SELF_PLACEMENT_OPTIONS.find(
    (o) => o.optionKey === str || String(o.stageNo) === str || o.stageName.toUpperCase() === str
  );

  return option ? option.stageNo : null;
};

/**
 * Core scoring calculation function for Career Planning Profiling (CRI)
 * Follows the exact 13-step specification from the Excel sheet.
 *
 * @param {object|Array} inputAnswers - Raw student answers
 * @param {object} options - Optional config { requireSP: true/false }
 * @returns {object} Full profiling calculation result and report display structure
 */
export const calculateProfiling = (inputAnswers, options = {}) => {
  const answers = normalizeProfilingAnswers(inputAnswers);

  // Step 1: Check completeness for the 15 rating items
  const requiredRatingKeys = [
    "SA1", "SA2", "SA3",
    "CE1", "CE2", "CE3",
    "DC1", "DC2", "DC3",
    "PP1", "PP2", "PP3",
    "CO1", "CO2", "CO3"
  ];

  const missingRatingKeys = requiredRatingKeys.filter(
    (k) => answers[k] === undefined || answers[k] === null || isNaN(answers[k]) || answers[k] < 1 || answers[k] > 5
  );

  const requireSP = options.requireSP !== undefined ? options.requireSP : true;
  let spStageNo = mapSPToStageNo(answers.SP);
  const isSPProvided = spStageNo !== null;

  if (missingRatingKeys.length > 0) {
    return {
      isComplete: false,
      missingItems: missingRatingKeys,
      message: `Please complete all 15 rating items. Missing: ${missingRatingKeys.join(", ")}`
    };
  }

  // Step 2: Reverse-code
  // DC2, DC3, CO2: scored = 6 - raw. All other items: scored = raw.
  const rawValues = {};
  const scoredValues = {};

  for (const k of requiredRatingKeys) {
    const raw = Number(answers[k]);
    rawValues[k] = raw;

    if (k === "DC2" || k === "DC3" || k === "CO2") {
      scoredValues[k] = 6 - raw;
    } else {
      scoredValues[k] = raw;
    }
  }

  // Step 3: Domain mean (Average of the 3 scored items in each domain)
  const mean_SA = (scoredValues.SA1 + scoredValues.SA2 + scoredValues.SA3) / 3;
  const mean_CE = (scoredValues.CE1 + scoredValues.CE2 + scoredValues.CE3) / 3;
  const mean_DC = (scoredValues.DC1 + scoredValues.DC2 + scoredValues.DC3) / 3;
  const mean_PP = (scoredValues.PP1 + scoredValues.PP2 + scoredValues.PP3) / 3;
  const mean_CO = (scoredValues.CO1 + scoredValues.CO2 + scoredValues.CO3) / 3;

  // Step 4: Domain score (0–100): score = ROUND((mean − 1) ÷ 4 × 100, 0)
  const score_SA = Math.round(((mean_SA - 1) / 4) * 100);
  const score_CE = Math.round(((mean_CE - 1) / 4) * 100);
  const score_DC = Math.round(((mean_DC - 1) / 4) * 100);
  const score_PP = Math.round(((mean_PP - 1) / 4) * 100);
  const score_CO = Math.round(((mean_CO - 1) / 4) * 100);

  // Step 5: Domain stage (Lookup each domain score in Stage_Bands)
  const stageBand_SA = getStageFromScore(score_SA);
  const stageBand_CE = getStageFromScore(score_CE);
  const stageBand_DC = getStageFromScore(score_DC);
  const stageBand_PP = getStageFromScore(score_PP);
  const stageBand_CO = getStageFromScore(score_CO);

  // Step 6: Career Readiness Index (CRI = average of 5 rounded domain scores, then rounded)
  const CRI = Math.round((score_SA + score_CE + score_DC + score_PP + score_CO) / 5);

  // Step 7: CRI stage (Place CRI on Stage_Bands)
  const criStageBand = getStageFromScore(CRI);
  const cri_stage_no = criStageBand.stageNo;

  // Step 8: Stage cap (guard)
  // cap = 5 if DC >= 80 AND PP >= 80; else 4 if DC >= 60; else 3
  let cap = 3;
  if (score_DC >= 80 && score_PP >= 80) {
    cap = 5;
  } else if (score_DC >= 60) {
    cap = 4;
  } else {
    cap = 3;
  }

  // Step 9: Overall stage
  // stage_no = MIN(cri_stage_no, cap). Stage name from Stage_Bands.
  const stage_no = Math.min(cri_stage_no, cap);
  const overallStageBand = STAGE_BANDS.find((b) => b.stageNo === stage_no) || STAGE_BANDS[0];
  const stage_code = overallStageBand.stageCode;
  const stage_name = overallStageBand.stage;

  // Step 10: Self-placement stage
  let spOptionKey = null;
  let spStageName = null;
  if (isSPProvided) {
    const matchedOption = SELF_PLACEMENT_OPTIONS.find((o) => o.stageNo === spStageNo);
    spOptionKey = matchedOption?.optionKey || answers.SP;
    spStageName = matchedOption?.stageName || getStageFromScore((spStageNo - 1) * 20 + 10).stage;
  }

  // Step 11: Flags
  // F1: 'Making a Choice' is at Clarity or above (DC >= 60) AND 'About Me' or 'Knowing About Careers' is at Confused or below (SA < 40 OR CE < 40)
  const isF1 = (score_DC >= 60) && (score_SA < 40 || score_CE < 40);

  // F2: CO2 raw >= 4 (Mostly true / Very true)
  const isF2 = rawValues.CO2 >= 4;

  // F3: CO3 raw <= 2 (Not true at all / Mostly not true)
  const isF3 = rawValues.CO3 <= 2;

  // F4: ABS(sp_stage_no - stage_no) >= 2 (only if SP is used)
  const isF4 = isSPProvided ? Math.abs(spStageNo - stage_no) >= 2 : false;

  const flagsList = [];
  if (isF1) {
    flagsList.push({
      flagId: "F1",
      name: FLAGS_DEFINITIONS.F1.name,
      conditionText: FLAGS_DEFINITIONS.F1.conditionText,
      studentText: FLAGS_DEFINITIONS.F1.studentText,
      counselorNote: FLAGS_DEFINITIONS.F1.counselorNote
    });
  }
  if (isF2) {
    flagsList.push({
      flagId: "F2",
      name: FLAGS_DEFINITIONS.F2.name,
      conditionText: FLAGS_DEFINITIONS.F2.conditionText,
      studentText: FLAGS_DEFINITIONS.F2.studentText,
      counselorNote: FLAGS_DEFINITIONS.F2.counselorNote
    });
  }
  if (isF3) {
    flagsList.push({
      flagId: "F3",
      name: FLAGS_DEFINITIONS.F3.name,
      conditionText: FLAGS_DEFINITIONS.F3.conditionText,
      studentText: FLAGS_DEFINITIONS.F3.studentText,
      counselorNote: FLAGS_DEFINITIONS.F3.counselorNote
    });
  }
  if (isF4) {
    const dynamicStudentText = FLAGS_DEFINITIONS.F4.studentTemplate
      .replace("[SP stage]", spStageName)
      .replace("[computed stage]", stage_name);

    flagsList.push({
      flagId: "F4",
      name: FLAGS_DEFINITIONS.F4.name,
      conditionText: FLAGS_DEFINITIONS.F4.conditionText,
      studentText: dynamicStudentText,
      counselorNote: FLAGS_DEFINITIONS.F4.counselorNote
    });
  }

  const flagsCount = flagsList.length;

  // Step 12: Risk Level
  // Base risk from the overall stage; raise by one level if (number of flags >= 2) OR (any domain is at the Unaware stage, i.e. score < 20). Maximum = High (4).
  const baseRiskInfo = BASE_RISK_BY_STAGE[stage_no];
  const base_risk_level = baseRiskInfo.baseRiskLevel;
  const base_risk_label = baseRiskInfo.baseRisk;

  const lowestDomainScore = Math.min(score_SA, score_CE, score_DC, score_PP, score_CO);
  const hasUnawareDomain = lowestDomainScore < 20;

  let final_risk_level = base_risk_level;
  if (flagsCount >= 2 || hasUnawareDomain) {
    final_risk_level = Math.min(4, base_risk_level + 1);
  }

  const finalRiskInfo = RISK_LEVEL_SCALE[final_risk_level];

  // Step 13: Report Assembly ("Your Profiling" Page)
  const outcomes = STAGE_OUTCOMES[stage_code] || STAGE_OUTCOMES.UNAWARE;

  const your5Areas = [
    {
      domainCode: "SA",
      domainStudentFacingName: PROFILING_DOMAINS.SA.studentFacingName,
      technicalName: PROFILING_DOMAINS.SA.technicalName,
      score: score_SA,
      stage: stageBand_SA.stage,
      stageNo: stageBand_SA.stageNo,
      stageCode: stageBand_SA.stageCode,
      label: `${PROFILING_DOMAINS.SA.studentFacingName} – ${stageBand_SA.stage}`,
      meaning: DOMAIN_STAGE_MEANINGS.SA[stageBand_SA.stage] || ""
    },
    {
      domainCode: "CE",
      domainStudentFacingName: PROFILING_DOMAINS.CE.studentFacingName,
      technicalName: PROFILING_DOMAINS.CE.technicalName,
      score: score_CE,
      stage: stageBand_CE.stage,
      stageNo: stageBand_CE.stageNo,
      stageCode: stageBand_CE.stageCode,
      label: `${PROFILING_DOMAINS.CE.studentFacingName} – ${stageBand_CE.stage}`,
      meaning: DOMAIN_STAGE_MEANINGS.CE[stageBand_CE.stage] || ""
    },
    {
      domainCode: "DC",
      domainStudentFacingName: PROFILING_DOMAINS.DC.studentFacingName,
      technicalName: PROFILING_DOMAINS.DC.technicalName,
      score: score_DC,
      stage: stageBand_DC.stage,
      stageNo: stageBand_DC.stageNo,
      stageCode: stageBand_DC.stageCode,
      label: `${PROFILING_DOMAINS.DC.studentFacingName} – ${stageBand_DC.stage}`,
      meaning: DOMAIN_STAGE_MEANINGS.DC[stageBand_DC.stage] || ""
    },
    {
      domainCode: "PP",
      domainStudentFacingName: PROFILING_DOMAINS.PP.studentFacingName,
      technicalName: PROFILING_DOMAINS.PP.technicalName,
      score: score_PP,
      stage: stageBand_PP.stage,
      stageNo: stageBand_PP.stageNo,
      stageCode: stageBand_PP.stageCode,
      label: `${PROFILING_DOMAINS.PP.studentFacingName} – ${stageBand_PP.stage}`,
      meaning: DOMAIN_STAGE_MEANINGS.PP[stageBand_PP.stage] || ""
    },
    {
      domainCode: "CO",
      domainStudentFacingName: PROFILING_DOMAINS.CO.studentFacingName,
      technicalName: PROFILING_DOMAINS.CO.technicalName,
      score: score_CO,
      stage: stageBand_CO.stage,
      stageNo: stageBand_CO.stageNo,
      stageCode: stageBand_CO.stageCode,
      label: `${PROFILING_DOMAINS.CO.studentFacingName} – ${stageBand_CO.stage}`,
      meaning: DOMAIN_STAGE_MEANINGS.CO[stageBand_CO.stage] || ""
    }
  ];

  const yourProfilingReport = {
    heading: "YOUR PROFILING",
    introParagraph: "Personal profiling is the first step in career planning. It helps you understand where you are right now on your career journey and gives you a clear path forward.",
    stageTrack: {
      title: "Current Stage of Planning",
      stages: STAGE_BANDS.map((b) => ({
        stageNo: b.stageNo,
        stageCode: b.stageCode,
        stageName: b.stage,
        isCurrent: b.stageNo === stage_no
      })),
      currentStageNo: stage_no,
      currentStageCode: stage_code,
      currentStageName: stage_name
    },
    riskBadge: {
      text: `Risk level: ${finalRiskInfo.label}`,
      label: finalRiskInfo.label,
      level: final_risk_level,
      colour: finalRiskInfo.colour,
      hexColor: finalRiskInfo.hexColor,
      baseRiskLevel: base_risk_level,
      baseRiskLabel: base_risk_label,
      isEscalated: final_risk_level > base_risk_level
    },
    whatItMeans: outcomes.whatItMeans,
    yourNextSteps: [
      outcomes.nextStep1,
      outcomes.nextStep2,
      outcomes.nextStep3
    ],
    your5Areas,
    careerReadinessScore: {
      cri: CRI,
      maxScore: 100,
      displayText: `Career Readiness Score: ${CRI}/100`,
      criStageNo: cri_stage_no,
      criStageName: criStageBand.stage,
      cap: cap,
      isCapped: stage_no < cri_stage_no
    },
    notesForYou: {
      hasNotes: flagsList.length > 0,
      notes: flagsList.map((f) => ({
        flagId: f.flagId,
        flagName: f.name,
        text: f.studentText
      }))
    },
    counselorView: {
      counselorNote: outcomes.counselorNote,
      stageNo: stage_no,
      stageCode: stage_code,
      stageName: stage_name,
      criScore: CRI,
      criStageNo: cri_stage_no,
      cap: cap,
      capApplied: stage_no < cri_stage_no,
      lowestDomainScore: lowestDomainScore,
      flagsCount: flagsCount,
      flagsDetails: [
        {
          flagId: "F1",
          name: FLAGS_DEFINITIONS.F1.name,
          triggered: isF1,
          counselorNote: FLAGS_DEFINITIONS.F1.counselorNote
        },
        {
          flagId: "F2",
          name: FLAGS_DEFINITIONS.F2.name,
          triggered: isF2,
          counselorNote: FLAGS_DEFINITIONS.F2.counselorNote
        },
        {
          flagId: "F3",
          name: FLAGS_DEFINITIONS.F3.name,
          triggered: isF3,
          counselorNote: FLAGS_DEFINITIONS.F3.counselorNote
        },
        {
          flagId: "F4",
          name: FLAGS_DEFINITIONS.F4.name,
          triggered: isF4,
          counselorNote: FLAGS_DEFINITIONS.F4.counselorNote
        }
      ],
      selfPlacement: isSPProvided ? {
        optionKey: spOptionKey,
        stageNo: spStageNo,
        stageName: spStageName,
        differsFromComputed: isF4
      } : null
    }
  };

  return {
    isComplete: true,
    rawResponses: rawValues,
    scoredResponses: scoredValues,
    spResponse: answers.SP || null,
    domainScores: {
      SA: score_SA,
      CE: score_CE,
      DC: score_DC,
      PP: score_PP,
      CO: score_CO
    },
    domainMeans: {
      SA: Number(mean_SA.toFixed(2)),
      CE: Number(mean_CE.toFixed(2)),
      DC: Number(mean_DC.toFixed(2)),
      PP: Number(mean_PP.toFixed(2)),
      CO: Number(mean_CO.toFixed(2))
    },
    domainStages: {
      SA: stageBand_SA.stage,
      CE: stageBand_CE.stage,
      DC: stageBand_DC.stage,
      PP: stageBand_PP.stage,
      CO: stageBand_CO.stage
    },
    domainStageNos: {
      SA: stageBand_SA.stageNo,
      CE: stageBand_CE.stageNo,
      DC: stageBand_DC.stageNo,
      PP: stageBand_PP.stageNo,
      CO: stageBand_CO.stageNo
    },
    cri: CRI,
    criStageNo: cri_stage_no,
    criStageName: criStageBand.stage,
    cap: cap,
    stageNo: stage_no,
    stageCode: stage_code,
    stageName: stage_name,
    spStageNo: spStageNo,
    spStageName: spStageName,
    flags: {
      F1: isF1,
      F2: isF2,
      F3: isF3,
      F4: isF4,
      count: flagsCount,
      list: flagsList
    },
    risk: {
      baseLevel: base_risk_level,
      baseLabel: base_risk_label,
      finalLevel: final_risk_level,
      finalLabel: finalRiskInfo.label,
      colour: finalRiskInfo.colour,
      hexColor: finalRiskInfo.hexColor,
      isEscalated: final_risk_level > base_risk_level,
      lowestDomainScore: lowestDomainScore
    },
    report: yourProfilingReport
  };
};

/**
 * Validates the scoring engine against all 7 test cases from the Excel sheet.
 * @returns {object} Summary of test execution and assertions
 */
export const validateProfilingAgainstTestCases = () => {
  const results = [];

  for (const tc of TEST_CASES) {
    const calc = calculateProfiling(tc.inputs);

    const check = {
      caseId: tc.caseId,
      description: tc.description,
      passed: true,
      diffs: []
    };

    const exp = tc.expected;

    if (calc.domainScores.SA !== exp.SA) check.diffs.push(`SA: got ${calc.domainScores.SA}, expected ${exp.SA}`);
    if (calc.domainScores.CE !== exp.CE) check.diffs.push(`CE: got ${calc.domainScores.CE}, expected ${exp.CE}`);
    if (calc.domainScores.DC !== exp.DC) check.diffs.push(`DC: got ${calc.domainScores.DC}, expected ${exp.DC}`);
    if (calc.domainScores.PP !== exp.PP) check.diffs.push(`PP: got ${calc.domainScores.PP}, expected ${exp.PP}`);
    if (calc.domainScores.CO !== exp.CO) check.diffs.push(`CO: got ${calc.domainScores.CO}, expected ${exp.CO}`);

    if (calc.domainStages.SA !== exp.SA_stage) check.diffs.push(`SA_stage: got ${calc.domainStages.SA}, expected ${exp.SA_stage}`);
    if (calc.domainStages.CE !== exp.CE_stage) check.diffs.push(`CE_stage: got ${calc.domainStages.CE}, expected ${exp.CE_stage}`);
    if (calc.domainStages.DC !== exp.DC_stage) check.diffs.push(`DC_stage: got ${calc.domainStages.DC}, expected ${exp.DC_stage}`);
    if (calc.domainStages.PP !== exp.PP_stage) check.diffs.push(`PP_stage: got ${calc.domainStages.PP}, expected ${exp.PP_stage}`);
    if (calc.domainStages.CO !== exp.CO_stage) check.diffs.push(`CO_stage: got ${calc.domainStages.CO}, expected ${exp.CO_stage}`);

    if (calc.cri !== exp.CRI) check.diffs.push(`CRI: got ${calc.cri}, expected ${exp.CRI}`);
    if (calc.criStageNo !== exp.CRI_stage_no) check.diffs.push(`CRI_stage_no: got ${calc.criStageNo}, expected ${exp.CRI_stage_no}`);
    if (calc.cap !== exp.Cap) check.diffs.push(`Cap: got ${calc.cap}, expected ${exp.Cap}`);
    if (calc.stageNo !== exp.Stage_no) check.diffs.push(`Stage_no: got ${calc.stageNo}, expected ${exp.Stage_no}`);
    if (calc.stageName !== exp.Stage) check.diffs.push(`Stage: got ${calc.stageName}, expected ${exp.Stage}`);
    if (calc.spStageNo !== exp.SP_stage_no) check.diffs.push(`SP_stage_no: got ${calc.spStageNo}, expected ${exp.SP_stage_no}`);

    if (calc.flags.F1 !== exp.F1) check.diffs.push(`F1: got ${calc.flags.F1}, expected ${exp.F1}`);
    if (calc.flags.F2 !== exp.F2) check.diffs.push(`F2: got ${calc.flags.F2}, expected ${exp.F2}`);
    if (calc.flags.F3 !== exp.F3) check.diffs.push(`F3: got ${calc.flags.F3}, expected ${exp.F3}`);
    if (calc.flags.F4 !== exp.F4) check.diffs.push(`F4: got ${calc.flags.F4}, expected ${exp.F4}`);

    if (calc.flags.count !== exp.flagCount) check.diffs.push(`flagCount: got ${calc.flags.count}, expected ${exp.flagCount}`);
    if (calc.risk.lowestDomainScore !== exp.lowestDomain) check.diffs.push(`lowestDomain: got ${calc.risk.lowestDomainScore}, expected ${exp.lowestDomain}`);
    if (calc.risk.baseLevel !== exp.baseRiskLevel) check.diffs.push(`baseRiskLevel: got ${calc.risk.baseLevel}, expected ${exp.baseRiskLevel}`);
    if (calc.risk.finalLevel !== exp.finalRiskLevel) check.diffs.push(`finalRiskLevel: got ${calc.risk.finalLevel}, expected ${exp.finalRiskLevel}`);
    if (calc.risk.finalLabel !== exp.finalRisk) check.diffs.push(`finalRisk: got ${calc.risk.finalLabel}, expected ${exp.finalRisk}`);

    if (check.diffs.length > 0) {
      check.passed = false;
    }

    results.push(check);
  }

  const allPassed = results.every((r) => r.passed);

  return {
    allPassed,
    totalCases: results.length,
    passedCases: results.filter((r) => r.passed).length,
    failedCases: results.filter((r) => !r.passed).length,
    results
  };
};
