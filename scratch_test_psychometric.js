import {
  calculateScores,
  calculateHollandCode,
  calculateClusterMatches,
  buildAssessmentReport,
  normalizeSectionCode,
  reverseLikertValue,
  normalizeLikertMean,
  getScoreBand
} from "./src/modules/psychometricassesment/psychoassessment.engine.js";

async function runEngineTests() {
  console.log("==================================================");
  console.log("🧪 TESTING PSYCHOMETRIC ASSESSMENT ENGINE");
  console.log("==================================================");

  // 1. Test helper functions
  console.log("\n--- 1. Testing Helper Functions ---");
  console.assert(normalizeSectionCode("INTERESTS") === "interest", "Section code normalizer failed for INTERESTS");
  console.assert(normalizeSectionCode("values") === "values", "Section code normalizer failed for values");
  console.assert(normalizeSectionCode("vark") === "learning_style", "Section code normalizer failed for vark");
  console.assert(normalizeSectionCode("aptitudes") === "aptitude", "Section code normalizer failed for aptitudes");
  console.log("✅ Section normalization passed.");

  console.assert(reverseLikertValue(false, 5) === 5, "Direct Likert 5 should be 5");
  console.assert(reverseLikertValue(true, 5) === 1, "Reverse Likert 5 should be 1");
  console.assert(reverseLikertValue(true, 1) === 5, "Reverse Likert 1 should be 5");
  console.assert(reverseLikertValue(true, 3) === 3, "Reverse Likert 3 should be 3");
  console.log("✅ Reverse Likert scoring passed.");

  console.assert(normalizeLikertMean(1) === 0.0, "Likert 1 normalized should be 0.0");
  console.assert(normalizeLikertMean(3) === 0.5, "Likert 3 normalized should be 0.5");
  console.assert(normalizeLikertMean(5) === 1.0, "Likert 5 normalized should be 1.0");
  console.log("✅ Likert normalization passed.");

  console.assert(getScoreBand(0.2).band === "developing", "Band < 0.35 should be developing");
  console.assert(getScoreBand(0.5).band === "moderate", "Band 0.5 should be moderate");
  console.assert(getScoreBand(0.85).band === "high", "Band > 0.70 should be high");
  console.log("✅ Score band classification passed.");

  // 2. Test Full Scoring Pipeline with Simulated Questions & Answers
  console.log("\n--- 2. Testing Calculation Engine on Sample Test ---");

  const sampleQuestions = [
    // Interest (RIASEC)
    { id: 1, sectionCode: "interest", itemId: "INT_R_1", type: "likert5", facet: "R", reverse: false },
    { id: 2, sectionCode: "interest", itemId: "INT_R_2", type: "likert5", facet: "R", reverse: false },
    { id: 3, sectionCode: "interest", itemId: "INT_I_1", type: "likert5", facet: "I", reverse: false },
    { id: 4, sectionCode: "interest", itemId: "INT_I_2", type: "likert5", facet: "I", reverse: false },
    { id: 5, sectionCode: "interest", itemId: "INT_A_1", type: "likert5", facet: "A", reverse: false },
    { id: 6, sectionCode: "interest", itemId: "INT_S_1", type: "likert5", facet: "S", reverse: false },
    { id: 7, sectionCode: "interest", itemId: "INT_E_1", type: "likert5", facet: "E", reverse: false },
    { id: 8, sectionCode: "interest", itemId: "INT_C_1", type: "likert5", facet: "C", reverse: false },

    // Big Five Personality
    { id: 9, sectionCode: "personality", itemId: "PER_O_1", type: "likert5", facet: "O", reverse: false },
    { id: 10, sectionCode: "personality", itemId: "PER_CN_1", type: "likert5", facet: "Cn", reverse: false },
    { id: 11, sectionCode: "personality", itemId: "PER_EX_1", type: "likert5", facet: "Ex", reverse: false },
    { id: 12, sectionCode: "personality", itemId: "PER_AG_1", type: "likert5", facet: "Ag", reverse: false },
    { id: 13, sectionCode: "personality", itemId: "PER_ES_1", type: "likert5", facet: "ES", reverse: true }, // reverse scored

    // Values
    { id: 14, sectionCode: "values", itemId: "VAL_OC_1", type: "likert5", facet: "OC", reverse: false },
    { id: 15, sectionCode: "values", itemId: "VAL_SE_1", type: "likert5", facet: "SE", reverse: false },
    { id: 16, sectionCode: "values", itemId: "VAL_CO_1", type: "likert5", facet: "CO", reverse: false },
    { id: 17, sectionCode: "values", itemId: "VAL_ST_1", type: "likert5", facet: "ST", reverse: false },

    // VARK
    { id: 18, sectionCode: "learning_style", itemId: "VARK_V_1", type: "likert5", facet: "V", reverse: false },
    { id: 19, sectionCode: "learning_style", itemId: "VARK_A_1", type: "likert5", facet: "A", reverse: false },
    { id: 20, sectionCode: "learning_style", itemId: "VARK_RD_1", type: "likert5", facet: "Rd", reverse: false },
    { id: 21, sectionCode: "learning_style", itemId: "VARK_K_1", type: "likert5", facet: "K", reverse: false },

    // Goal orientation
    { id: 22, sectionCode: "goal_orientation", itemId: "GOAL_L_1", type: "likert5", facet: "L", reverse: false },
    { id: 23, sectionCode: "goal_orientation", itemId: "GOAL_S_1", type: "likert5", facet: "S", reverse: false },

    // Aptitude (MCQ)
    {
      id: 24, sectionCode: "aptitude", itemId: "APT_MECH_1", type: "mcq", facet: "Mech",
      options: [
        { id: 101, optionText: "Gear A", isCorrect: true },
        { id: 102, optionText: "Gear B", isCorrect: false }
      ]
    },
    {
      id: 25, sectionCode: "aptitude", itemId: "APT_LOG_1", type: "mcq", facet: "Log",
      options: [
        { id: 103, optionText: "Option 1", isCorrect: false },
        { id: 104, optionText: "Option 2", isCorrect: true }
      ]
    },
    {
      id: 26, sectionCode: "aptitude", itemId: "APT_VERB_1", type: "mcq", facet: "Verb",
      options: [
        { id: 105, optionText: "Synonym A", isCorrect: true },
        { id: 106, optionText: "Synonym B", isCorrect: false }
      ]
    },
    {
      id: 27, sectionCode: "aptitude", itemId: "APT_SPAT_1", type: "mcq", facet: "Spat",
      options: [
        { id: 107, optionText: "Rotation 1", isCorrect: true },
        { id: 108, optionText: "Rotation 2", isCorrect: false }
      ]
    },
    {
      id: 28, sectionCode: "aptitude", itemId: "APT_NUM_1", type: "mcq", facet: "Num",
      options: [
        { id: 109, optionText: "42", isCorrect: true },
        { id: 110, optionText: "56", isCorrect: false }
      ]
    },
    {
      id: 29, sectionCode: "aptitude", itemId: "APT_VOC_1", type: "mcq", facet: "Voc",
      options: [
        { id: 111, optionText: "Definition A", isCorrect: true },
        { id: 112, optionText: "Definition B", isCorrect: false }
      ]
    },
    // Profiling (16 items)
    { id: 100, sectionCode: "profiling", itemId: "SA1", type: "likert5", facet: "SA", reverse: false },
    { id: 101, sectionCode: "profiling", itemId: "SA2", type: "likert5", facet: "SA", reverse: false },
    { id: 102, sectionCode: "profiling", itemId: "SA3", type: "likert5", facet: "SA", reverse: false },
    { id: 103, sectionCode: "profiling", itemId: "CE1", type: "likert5", facet: "CE", reverse: false },
    { id: 104, sectionCode: "profiling", itemId: "CE2", type: "likert5", facet: "CE", reverse: false },
    { id: 105, sectionCode: "profiling", itemId: "CE3", type: "likert5", facet: "CE", reverse: false },
    { id: 106, sectionCode: "profiling", itemId: "DC1", type: "likert5", facet: "DC", reverse: false },
    { id: 107, sectionCode: "profiling", itemId: "DC2", type: "likert5", facet: "DC", reverse: true },
    { id: 108, sectionCode: "profiling", itemId: "DC3", type: "likert5", facet: "DC", reverse: true },
    { id: 109, sectionCode: "profiling", itemId: "PP1", type: "likert5", facet: "PP", reverse: false },
    { id: 110, sectionCode: "profiling", itemId: "PP2", type: "likert5", facet: "PP", reverse: false },
    { id: 111, sectionCode: "profiling", itemId: "PP3", type: "likert5", facet: "PP", reverse: false },
    { id: 112, sectionCode: "profiling", itemId: "CO1", type: "likert5", facet: "CO", reverse: false },
    { id: 113, sectionCode: "profiling", itemId: "CO2", type: "likert5", facet: "CO", reverse: true },
    { id: 114, sectionCode: "profiling", itemId: "CO3", type: "likert5", facet: "CO", reverse: false },
    { id: 115, sectionCode: "profiling", itemId: "SP", type: "single_choice", facet: "SP", reverse: false, options: [{ id: 201, optionText: "D. Clarity" }] }
  ];

  // Candidate answers:
  // High in Realistic (5, 5), High in Investigative (5, 5), Moderate in Conventional (4), Low in others
  // In Aptitude: all correct except Verbal
  // In Profiling: T4 (Decided, path unclear: SA=83, CE=58, DC=83, PP=50, CO=75 -> Stage 4 Clarity)
  const sampleAnswers = [
    // Profiling (T4 answers)
    { questionId: 100, likertValue: 4 }, // SA1
    { questionId: 101, likertValue: 4 }, // SA2
    { questionId: 102, likertValue: 5 }, // SA3
    { questionId: 103, likertValue: 4 }, // CE1
    { questionId: 104, likertValue: 3 }, // CE2
    { questionId: 105, likertValue: 3 }, // CE3
    { questionId: 106, likertValue: 5 }, // DC1
    { questionId: 107, likertValue: 2 }, // DC2 (rev)
    { questionId: 108, likertValue: 2 }, // DC3 (rev)
    { questionId: 109, likertValue: 4 }, // PP1
    { questionId: 110, likertValue: 3 }, // PP2
    { questionId: 111, likertValue: 2 }, // PP3
    { questionId: 112, likertValue: 4 }, // CO1
    { questionId: 113, likertValue: 2 }, // CO2 (rev)
    { questionId: 114, likertValue: 4 }, // CO3
    { questionId: 115, selectedOptionId: 201 }, // SP -> D

    { questionId: 1, likertValue: 5 }, // R -> 5
    { questionId: 2, likertValue: 5 }, // R -> 5 (R = 1.0 / 100%)
    { questionId: 3, likertValue: 5 }, // I -> 5
    { questionId: 4, likertValue: 5 }, // I -> 5 (I = 1.0 / 100%)
    { questionId: 5, likertValue: 2 }, // A -> 2 (A = 0.25 / 25%)
    { questionId: 6, likertValue: 2 }, // S -> 2 (S = 0.25 / 25%)
    { questionId: 7, likertValue: 3 }, // E -> 3 (E = 0.50 / 50%)
    { questionId: 8, likertValue: 4 }, // C -> 4 (C = 0.75 / 75%)

    { questionId: 9, likertValue: 4 }, // O -> 0.75
    { questionId: 10, likertValue: 5 }, // Cn -> 1.0
    { questionId: 11, likertValue: 3 }, // Ex -> 0.5
    { questionId: 12, likertValue: 4 }, // Ag -> 0.75
    { questionId: 13, likertValue: 1 }, // ES reverse! 1 becomes 5 -> 1.0

    { questionId: 14, likertValue: 4 }, // OC -> 0.75
    { questionId: 15, likertValue: 3 }, // SE -> 0.5
    { questionId: 16, likertValue: 4 }, // CO -> 0.75
    { questionId: 17, likertValue: 3 }, // ST -> 0.5

    { questionId: 18, likertValue: 5 }, // V -> 1.0
    { questionId: 19, likertValue: 3 }, // A -> 0.5
    { questionId: 20, likertValue: 4 }, // Rd -> 0.75
    { questionId: 21, likertValue: 4 }, // K -> 0.75

    { questionId: 22, likertValue: 5 }, // Goal L -> 1.0
    { questionId: 23, likertValue: 3 }, // Goal S -> 0.5

    // Aptitude answers
    { questionId: 24, selectedOptionId: 101 }, // Mech -> correct (1.0)
    { questionId: 25, selectedOptionId: 104 }, // Log -> correct (1.0)
    { questionId: 26, selectedOptionId: 106 }, // Verb -> incorrect (0.0)
    { questionId: 27, selectedOptionId: 107 }, // Spat -> correct (1.0)
    { questionId: 28, selectedOptionId: 109 }, // Num -> correct (1.0)
    { questionId: 29, selectedOptionId: 111 }  // Voc -> correct (1.0)
  ];

  // Calculate scores
  const scores = calculateScores(sampleQuestions, sampleAnswers);
  console.log("\nCalculated Scores:", JSON.stringify(scores, null, 2));

  console.assert(scores.R === 1.0, `Expected R = 1.0, got ${scores.R}`);
  console.assert(scores.I === 1.0, `Expected I = 1.0, got ${scores.I}`);
  console.assert(scores.C === 0.75, `Expected C = 0.75, got ${scores.C}`);
  console.assert(scores.ES === 1.0, `Expected ES = 1.0 (reverse 1 -> 5), got ${scores.ES}`);
  console.assert(scores.Mech === 1.0, `Expected Mech = 1.0, got ${scores.Mech}`);
  console.assert(scores.Verb === 0.0, `Expected Verb = 0.0, got ${scores.Verb}`);
  console.assert(scores.profiling && scores.profiling.stageName === "Clarity", "Profiling stage should be Clarity for T4");
  console.assert(scores.profiling && scores.profiling.cri === 70, "Profiling CRI should be 70 for T4");
  console.log("✅ Scores & Profiling calculated accurately!");

  // Holland Code
  const hollandCode = calculateHollandCode(scores);
  console.log("\nCalculated Holland Code:", hollandCode);
  console.assert(
    hollandCode.startsWith("R") && hollandCode.includes("I") && hollandCode.includes("C"),
    `Expected Holland code with top traits R, I, C, got ${hollandCode}`
  );
  console.log("✅ Holland code calculation verified!");

  // Career Clusters
  const sampleClusters = [
    {
      id: 1,
      code: "ENG_TECH",
      name: "Engineering & Technology",
      hollandCode: "RIC",
      description: "Focus on designing, building, and maintaining mechanical, electrical, and software systems.",
      weights: [
        { facet: "R", weight: 3 },
        { facet: "I", weight: 3 },
        { facet: "Mech", weight: 3 },
        { facet: "Log", weight: 3 },
        { facet: "Num", weight: 2 },
        { facet: "Cn", weight: 2 },
        { facet: "OC", weight: 2 }
      ]
    },
    {
      id: 2,
      code: "ARTS_COMM",
      name: "Arts & Communication",
      hollandCode: "AES",
      description: "Visual, performing arts, media, and creative expression.",
      weights: [
        { facet: "A", weight: 4 },
        { facet: "E", weight: 2 },
        { facet: "Verb", weight: 3 },
        { facet: "O", weight: 3 },
        { facet: "OC", weight: 3 }
      ]
    },
    {
      id: 3,
      code: "HEALTH_SCI",
      name: "Health & Clinical Sciences",
      hollandCode: "ISR",
      description: "Medical diagnosis, biology, research, and patient care.",
      weights: [
        { facet: "I", weight: 3 },
        { facet: "S", weight: 3 },
        { facet: "Log", weight: 2 },
        { facet: "Verb", weight: 2 },
        { facet: "Ag", weight: 2 },
        { facet: "ST", weight: 3 }
      ]
    }
  ];

  const clusterMatches = calculateClusterMatches(scores, sampleClusters);
  console.log("\nRanked Career Cluster Matches:");
  clusterMatches.forEach((c, idx) => {
    console.log(`  #${idx + 1} ${c.name} (${c.code}): ${Math.round(c.match * 100)}% match [FitI: ${Math.round(c.fitI * 100)}%, FitA: ${Math.round(c.fitA * 100)}%, FitP: ${Math.round(c.fitP * 100)}%, FitV: ${Math.round(c.fitV * 100)}%]`);
  });

  console.assert(clusterMatches[0].code === "ENG_TECH", `Expected top cluster to be ENG_TECH, got ${clusterMatches[0].code}`);
  console.assert(clusterMatches[0].match > 0.85, `Expected ENG_TECH match > 85%, got ${clusterMatches[0].match}`);
  console.log("✅ Career Cluster matching engine verified!");

  // Build Full Report
  const report = buildAssessmentReport({
    studentName: "John Doe",
    className: "12th Grade",
    school: "Springfield High",
    scores,
    hollandCode,
    rankedClusters: clusterMatches,
    completedAt: new Date()
  });

  // Verify Profiling Block in Full Report
  console.assert(report.yourProfiling !== null, "yourProfiling block should be present in full report");
  console.assert(report.yourProfiling.heading === "YOUR PROFILING", "yourProfiling heading must be 'YOUR PROFILING'");
  console.assert(report.yourProfiling.stageTrack.currentStageName === "Clarity", "yourProfiling currentStageName must be Clarity");
  console.assert(report.yourProfiling.your5Areas.length === 5, "yourProfiling should have 5 area breakdowns");
  console.log("✅ 'YOUR PROFILING' page block successfully placed as top section in Report!");

  // Verify facet name mappings
  const artisticInterest = report.domains.interests.find(i => i.facet === "A");
  const socialInterest = report.domains.interests.find(i => i.facet === "S");
  const auditoryVark = report.domains.learningStyles.find(l => l.facet === "A");
  const vocAptitude = report.domains.aptitudes.find(a => a.facet === "Voc");

  console.assert(artisticInterest?.name === "Artistic", `Expected Interest 'A' to be 'Artistic', got '${artisticInterest?.name}'`);
  console.assert(socialInterest?.name === "Social", `Expected Interest 'S' to be 'Social', got '${socialInterest?.name}'`);
  console.assert(auditoryVark?.name === "Auditory", `Expected VARK 'A' to be 'Auditory', got '${auditoryVark?.name}'`);
  console.assert(vocAptitude?.name === "Vocabulary", `Expected Aptitude 'Voc' to be 'Vocabulary', got '${vocAptitude?.name}'`);
  console.log("✅ All Facet mappings (Artistic, Social, Auditory, Vocabulary) verified correctly!");

  console.log("\n==================================================");
  console.log("🎉 ALL ENGINE & PROFILING VERIFICATIONS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

runEngineTests().catch(console.error);
