// ============================================================
// PERSONAL PROFILING / CAREER PLANNING TRACK (CRI) CONSTANTS
// Spec Source: Excel Specification (Overview, Domains, Questions,
// Response_Scale, Scoring_Steps, Stage_Bands, Flags, Risk,
// Outcomes, Domain_Meaning, Report_Display, Test_Cases)
// ============================================================

export const STAGE_BANDS = [
  { min: 0, max: 19, stage: "Unaware", stageCode: "UNAWARE", stageNo: 1 },
  { min: 20, max: 39, stage: "Confused", stageCode: "CONFUSED", stageNo: 2 },
  { min: 40, max: 59, stage: "Exploring", stageCode: "EXPLORING", stageNo: 3 },
  { min: 60, max: 79, stage: "Clarity", stageCode: "CLARITY", stageNo: 4 },
  { min: 80, max: 100, stage: "Future-Ready", stageCode: "FUTURE_READY", stageNo: 5 }
];

export const PROFILING_DOMAINS = {
  SA: {
    code: "SA",
    studentFacingName: "About Me",
    technicalName: "Self-Awareness",
    whatItMeasures: "Does the student know their own interests, strengths and values?",
    items: ["SA1", "SA2", "SA3"],
    scoreRange: "0–100",
    output: "Stage (via Stage_Bands)",
    weightInCRI: 0.20,
    weightPercent: "20%"
  },
  CE: {
    code: "CE",
    studentFacingName: "Knowing About Careers",
    technicalName: "Career Exploration",
    whatItMeasures: "Does the student know about many careers and actively look for information?",
    items: ["CE1", "CE2", "CE3"],
    scoreRange: "0–100",
    output: "Stage (via Stage_Bands)",
    weightInCRI: 0.20,
    weightPercent: "20%"
  },
  DC: {
    code: "DC",
    studentFacingName: "Making a Choice",
    technicalName: "Decision Clarity",
    whatItMeasures: "Does the student have a direction and stay steady on it?",
    items: ["DC1", "DC2", "DC3"],
    scoreRange: "0–100",
    output: "Stage (via Stage_Bands)",
    weightInCRI: 0.20,
    weightPercent: "20%"
  },
  PP: {
    code: "PP",
    studentFacingName: "Knowing the Path",
    technicalName: "Pathway & Planning",
    whatItMeasures: "Does the student know the stream, exams and courses needed, and have they started acting?",
    items: ["PP1", "PP2", "PP3"],
    scoreRange: "0–100",
    output: "Stage (via Stage_Bands)",
    weightInCRI: 0.20,
    weightPercent: "20%"
  },
  CO: {
    code: "CO",
    studentFacingName: "Feeling Sure",
    technicalName: "Confidence & Ownership",
    whatItMeasures: "Does the student feel able to decide, without heavy worry, and own the choice?",
    items: ["CO1", "CO2", "CO3"],
    scoreRange: "0–100",
    output: "Stage (via Stage_Bands)",
    weightInCRI: 0.20,
    weightPercent: "20%"
  },
  SP: {
    code: "SP",
    studentFacingName: "Where Am I Right Now?",
    technicalName: "Self-Placement (optional)",
    whatItMeasures: "Student's own view of their stage. NOT part of the CRI and does not decide the stage; used only for the 'Different view' flag.",
    items: ["SP"],
    scoreRange: "Stage 1–5",
    output: "Stage chosen by student",
    weightInCRI: 0,
    weightPercent: "0%",
    isOptional: true
  }
};

export const LIKERT_RESPONSE_SCALE = [
  { rawValue: 1, label: "Not true at all", normalScored: 1, reverseScored: 5 },
  { rawValue: 2, label: "Mostly not true", normalScored: 2, reverseScored: 4 },
  { rawValue: 3, label: "Not sure", normalScored: 3, reverseScored: 3 },
  { rawValue: 4, label: "Mostly true", normalScored: 4, reverseScored: 2 },
  { rawValue: 5, label: "Very true", normalScored: 5, reverseScored: 1 }
];

export const SELF_PLACEMENT_OPTIONS = [
  { optionKey: "A", text: "I have not really thought about my career yet.", stageName: "Unaware", stageCode: "UNAWARE", stageNo: 1 },
  { optionKey: "B", text: "I have thought about it, but I feel confused.", stageName: "Confused", stageCode: "CONFUSED", stageNo: 2 },
  { optionKey: "C", text: "I am looking at a few options and learning more about them.", stageName: "Exploring", stageCode: "EXPLORING", stageNo: 3 },
  { optionKey: "D", text: "I know what I want, but I don't know the full path yet.", stageName: "Clarity", stageCode: "CLARITY", stageNo: 4 },
  { optionKey: "E", text: "I know what I want, and I have already started working towards it.", stageName: "Future-Ready", stageCode: "FUTURE_READY", stageNo: 5 }
];

export const PROFILING_QUESTIONS = [
  {
    itemId: "SA1",
    displayOrder: 1,
    domainCode: "SA",
    domainStudentFacing: "About Me",
    questionText: "I know at least three things I really like doing.",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "SA2",
    displayOrder: 2,
    domainCode: "SA",
    domainStudentFacing: "About Me",
    questionText: "I know which subjects or activities I am good at.",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "SA3",
    displayOrder: 3,
    domainCode: "SA",
    domainStudentFacing: "About Me",
    questionText: "I know what is important to me in a future job (like good salary, helping people, being creative, or a safe job).",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "CE1",
    displayOrder: 4,
    domainCode: "CE",
    domainStudentFacing: "Knowing About Careers",
    questionText: "I know about many careers, not only doctor, engineer, or CA.",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "CE2",
    displayOrder: 5,
    domainCode: "CE",
    domainStudentFacing: "Knowing About Careers",
    questionText: "In the last six months, I have searched for information about careers I may like.",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "CE3",
    displayOrder: 6,
    domainCode: "CE",
    domainStudentFacing: "Knowing About Careers",
    questionText: "I have talked to someone who works in a field I like, and asked about their work.",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "DC1",
    displayOrder: 7,
    domainCode: "DC",
    domainStudentFacing: "Making a Choice",
    questionText: "I know which field or career I want to go into.",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "DC2",
    displayOrder: 8,
    domainCode: "DC",
    domainStudentFacing: "Making a Choice",
    questionText: "I keep changing my mind about which career I want.",
    responseType: "likert5",
    reverseScored: true,
    scoringRule: "Scored = 6 − raw",
    required: true
  },
  {
    itemId: "DC3",
    displayOrder: 9,
    domainCode: "DC",
    domainStudentFacing: "Making a Choice",
    questionText: "There are so many choices that I don't know which one to pick.",
    responseType: "likert5",
    reverseScored: true,
    scoringRule: "Scored = 6 − raw",
    required: true
  },
  {
    itemId: "PP1",
    displayOrder: 10,
    domainCode: "PP",
    domainStudentFacing: "Knowing the Path",
    questionText: "I know which stream (Science, Commerce, Arts) or subjects I need for the career I want.",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "PP2",
    displayOrder: 11,
    domainCode: "PP",
    domainStudentFacing: "Knowing the Path",
    questionText: "I know which entrance exams, courses, or colleges I need for the career I want.",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "PP3",
    displayOrder: 12,
    domainCode: "PP",
    domainStudentFacing: "Knowing the Path",
    questionText: "I have already started doing something for my career goal (like a course, practice, or a project).",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "CO1",
    displayOrder: 13,
    domainCode: "CO",
    domainStudentFacing: "Feeling Sure",
    questionText: "I believe I can make a good career choice.",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "CO2",
    displayOrder: 14,
    domainCode: "CO",
    domainStudentFacing: "Feeling Sure",
    questionText: "When I think about my career, I feel worried or tense.",
    responseType: "likert5",
    reverseScored: true,
    scoringRule: "Scored = 6 − raw",
    required: true
  },
  {
    itemId: "CO3",
    displayOrder: 15,
    domainCode: "CO",
    domainStudentFacing: "Feeling Sure",
    questionText: "The career I choose will be my own choice, even if I take advice from others.",
    responseType: "likert5",
    reverseScored: false,
    scoringRule: "Scored = raw",
    required: true
  },
  {
    itemId: "SP",
    displayOrder: 16,
    domainCode: "SP",
    domainStudentFacing: "Where Am I Right Now? (optional)",
    questionText: "Pick the one sentence that fits you best:",
    responseType: "single_choice",
    reverseScored: false,
    scoringRule: "Map option A–E to stage number 1–5",
    required: true,
    options: SELF_PLACEMENT_OPTIONS
  }
];

export const FLAGS_DEFINITIONS = {
  F1: {
    flagId: "F1",
    name: "Decided too early",
    conditionText: "'Making a Choice' is at Clarity or above (DC >= 60) AND 'About Me' or 'Knowing About Careers' is at Confused or below (SA < 40 OR CE < 40)",
    studentText: "You seem sure about your career, but you may not know enough about yourself or other options yet. Make sure this choice really matches what you like and what you are good at.",
    counselorNote: "Possible early commitment without enough exploration. Discuss options before locking in."
  },
  F2: {
    flagId: "F2",
    name: "Worry",
    conditionText: "CO2 raw >= 4 (Mostly true / Very true)",
    studentText: "Thinking about your career seems to make you worried. Talking to a counsellor can help.",
    counselorNote: "Career-related worry reported. Check in with the student."
  },
  F3: {
    flagId: "F3",
    name: "Pressure from others",
    conditionText: "CO3 raw <= 2 (Not true at all / Mostly not true)",
    studentText: "Your career choice may depend a lot on what others expect from you. Take some time to think about what you want.",
    counselorNote: "Low ownership of the choice. Consider a conversation with parents."
  },
  F4: {
    flagId: "F4",
    name: "Different view",
    conditionText: "ABS(sp_stage_no − stage_no) >= 2",
    studentTemplate: "You think you are at the [SP stage] stage, but your answers show [computed stage]. You can talk about this with your counsellor.",
    counselorNote: "If SP > computed: over-rating own readiness. If SP < computed: under-confident. Replace [ ] with stage display names."
  }
};

export const RISK_LEVEL_SCALE = {
  1: { level: 1, label: "Low", colour: "Green", hexColor: "#2E7A7A" },
  2: { level: 2, label: "Low to Medium", colour: "Light green", hexColor: "#4CAF50" },
  3: { level: 3, label: "Medium", colour: "Amber", hexColor: "#F59E0B" },
  4: { level: 4, label: "High", colour: "Red", hexColor: "#EF4444" }
};

export const BASE_RISK_BY_STAGE = {
  1: { stage: "Unaware", baseRisk: "High", baseRiskLevel: 4 },
  2: { stage: "Confused", baseRisk: "High", baseRiskLevel: 4 },
  3: { stage: "Exploring", baseRisk: "Medium", baseRiskLevel: 3 },
  4: { stage: "Clarity", baseRisk: "Low to Medium", baseRiskLevel: 2 },
  5: { stage: "Future-Ready", baseRisk: "Low", baseRiskLevel: 1 }
};

export const STAGE_OUTCOMES = {
  UNAWARE: {
    stageCode: "UNAWARE",
    stageDisplay: "Unaware",
    trackPosition: 1,
    baseRisk: "High",
    baseRiskLevel: 4,
    whatItMeans: "You have not started thinking about your career yet. That's okay at your age, but if you don't think about it, others may end up choosing your stream or career for you.",
    nextStep1: "Read your interest and personality results in this report.",
    nextStep2: "Write down 5 careers you know and find out what people in those jobs actually do.",
    nextStep3: "Talk to a parent or teacher about careers this month.",
    counselorNote: "Low engagement. Start with self-awareness activities."
  },
  CONFUSED: {
    stageCode: "CONFUSED",
    stageDisplay: "Confused",
    trackPosition: 2,
    baseRisk: "High",
    baseRiskLevel: 4,
    whatItMeans: "You have started thinking about your career, but you feel stuck because there are too many choices. Feeling confused is normal. It shows you want to choose well.",
    nextStep1: "First look at your Top Career Cluster, not single jobs.",
    nextStep2: "Pick 3 careers from it and compare what you like and what you are good at.",
    nextStep3: "If you feel very stressed, talk to your school counsellor.",
    counselorNote: "Decision difficulty. Help narrow options; watch for worry (F2)."
  },
  EXPLORING: {
    stageCode: "EXPLORING",
    stageDisplay: "Exploring",
    trackPosition: 3,
    baseRisk: "Medium",
    baseRiskLevel: 3,
    whatItMeans: "You are finding out about different careers. This is a great step. Now you need to move from \"finding out\" to \"choosing\".",
    nextStep1: "From the \"List of Careers\", pick your top 2 careers.",
    nextStep2: "Try a short course, workshop, or spend a day with someone working in each field.",
    nextStep3: "Fix a date by which you will choose your stream or direction.",
    counselorNote: "Active exploration. Support decision-making with a deadline."
  },
  CLARITY: {
    stageCode: "CLARITY",
    stageDisplay: "Clarity",
    trackPosition: 4,
    baseRisk: "Low to Medium",
    baseRiskLevel: 2,
    whatItMeans: "You know what you want to do. Now you need a clear path: which subjects, which exams, and which skills.",
    nextStep1: "Read the \"How to Get There\" section for your career cluster.",
    nextStep2: "Note down entrance exam dates, eligibility, and how much time you need to prepare.",
    nextStep3: "Start learning one useful skill this term.",
    counselorNote: "Direction set. Focus on pathway planning; check F1."
  },
  FUTURE_READY: {
    stageCode: "FUTURE_READY",
    stageDisplay: "Future-Ready",
    trackPosition: 5,
    baseRisk: "Low",
    baseRiskLevel: 1,
    whatItMeans: "You have a clear goal and have already started working on it. Well done! Keep checking that this goal still suits you.",
    nextStep1: "Look at your plan again every 6 months.",
    nextStep2: "Keep a backup career in the same cluster.",
    nextStep3: "Find a mentor or an internship in your field.",
    counselorNote: "Ready. Encourage regular review and a backup plan; check F1."
  }
};

export const DOMAIN_STAGE_MEANINGS = {
  SA: {
    Unaware: "You have not yet thought much about what you like or what you are good at.",
    Confused: "You have some idea about yourself, but it is still not clear.",
    Exploring: "You are discovering your interests and strengths.",
    Clarity: "You know your main interests, strengths and what matters to you.",
    "Future-Ready": "You know yourself very well and can use this to choose your career."
  },
  CE: {
    Unaware: "You know very few careers and have not looked for information yet.",
    Confused: "You know some careers, but mostly the common ones.",
    Exploring: "You are finding out about different careers.",
    Clarity: "You know about many careers and look for information on your own.",
    "Future-Ready": "You know many careers well and have talked to people working in them."
  },
  DC: {
    Unaware: "You have not started thinking about which career to choose.",
    Confused: "You keep changing your mind or feel lost among too many choices.",
    Exploring: "You have a few ideas, but you have not decided yet.",
    Clarity: "You have a clear idea of the career you want.",
    "Future-Ready": "You are sure about your choice and it stays steady."
  },
  PP: {
    Unaware: "You don't yet know the stream, exams or steps for any career.",
    Confused: "You know a little about the path, but many steps are not clear.",
    Exploring: "You know some of the steps for the field you like.",
    Clarity: "You know the stream, exams and courses you need.",
    "Future-Ready": "You know your full path and have already started working on it."
  },
  CO: {
    Unaware: "You feel very unsure or worried, and the choice may not feel like yours.",
    Confused: "You feel unsure and a little worried about choosing.",
    Exploring: "You feel somewhat sure, with some worries.",
    Clarity: "You feel confident about choosing your career.",
    "Future-Ready": "You feel fully confident and the choice is truly your own."
  }
};

export const TEST_CASES = [
  {
    caseId: "T1",
    description: "Has not thought about careers",
    inputs: {
      SA1: 2, SA2: 2, SA3: 1,
      CE1: 1, CE2: 1, CE3: 1,
      DC1: 1, DC2: 4, DC3: 3,
      PP1: 1, PP2: 1, PP3: 1,
      CO1: 2, CO2: 3, CO3: 3,
      SP: "A"
    },
    expected: {
      SA: 17, CE: 0, DC: 25, PP: 0, CO: 42,
      SA_stage: "Unaware", CE_stage: "Unaware", DC_stage: "Confused", PP_stage: "Unaware", CO_stage: "Exploring",
      CRI: 17, CRI_stage_no: 1, Cap: 3, Stage_no: 1, Stage: "Unaware",
      SP_stage_no: 1,
      F1: false, F2: false, F3: false, F4: false,
      flagCount: 0, lowestDomain: 0,
      baseRiskLevel: 4, finalRiskLevel: 4, finalRisk: "High"
    }
  },
  {
    caseId: "T2",
    description: "Stuck, many choices, worried",
    inputs: {
      SA1: 4, SA2: 3, SA3: 3,
      CE1: 3, CE2: 2, CE3: 1,
      DC1: 2, DC2: 5, DC3: 5,
      PP1: 1, PP2: 2, PP3: 1,
      CO1: 2, CO2: 5, CO3: 3,
      SP: "B"
    },
    expected: {
      SA: 58, CE: 25, DC: 8, PP: 8, CO: 25,
      SA_stage: "Exploring", CE_stage: "Confused", DC_stage: "Unaware", PP_stage: "Unaware", CO_stage: "Confused",
      CRI: 25, CRI_stage_no: 2, Cap: 3, Stage_no: 2, Stage: "Confused",
      SP_stage_no: 2,
      F1: false, F2: true, F3: false, F4: false,
      flagCount: 1, lowestDomain: 8,
      baseRiskLevel: 4, finalRiskLevel: 4, finalRisk: "High"
    }
  },
  {
    caseId: "T3",
    description: "Actively exploring",
    inputs: {
      SA1: 4, SA2: 4, SA3: 4,
      CE1: 4, CE2: 4, CE3: 3,
      DC1: 3, DC2: 3, DC3: 4,
      PP1: 2, PP2: 3, PP3: 2,
      CO1: 3, CO2: 3, CO3: 4,
      SP: "C"
    },
    expected: {
      SA: 75, CE: 67, DC: 42, PP: 33, CO: 58,
      SA_stage: "Clarity", CE_stage: "Clarity", DC_stage: "Exploring", PP_stage: "Confused", CO_stage: "Exploring",
      CRI: 55, CRI_stage_no: 3, Cap: 3, Stage_no: 3, Stage: "Exploring",
      SP_stage_no: 3,
      F1: false, F2: false, F3: false, F4: false,
      flagCount: 0, lowestDomain: 33,
      baseRiskLevel: 3, finalRiskLevel: 3, finalRisk: "Medium"
    }
  },
  {
    caseId: "T4",
    description: "Decided, path unclear",
    inputs: {
      SA1: 4, SA2: 4, SA3: 5,
      CE1: 4, CE2: 3, CE3: 3,
      DC1: 5, DC2: 2, DC3: 2,
      PP1: 4, PP2: 3, PP3: 2,
      CO1: 4, CO2: 2, CO3: 4,
      SP: "D"
    },
    expected: {
      SA: 83, CE: 58, DC: 83, PP: 50, CO: 75,
      SA_stage: "Future-Ready", CE_stage: "Exploring", DC_stage: "Future-Ready", PP_stage: "Exploring", CO_stage: "Clarity",
      CRI: 70, CRI_stage_no: 4, Cap: 4, Stage_no: 4, Stage: "Clarity",
      SP_stage_no: 4,
      F1: false, F2: false, F3: false, F4: false,
      flagCount: 0, lowestDomain: 50,
      baseRiskLevel: 2, finalRiskLevel: 2, finalRisk: "Low to Medium"
    }
  },
  {
    caseId: "T5",
    description: "Decided, planned, acting",
    inputs: {
      SA1: 5, SA2: 4, SA3: 5,
      CE1: 4, CE2: 5, CE3: 4,
      DC1: 5, DC2: 1, DC3: 1,
      PP1: 5, PP2: 4, PP3: 4,
      CO1: 4, CO2: 2, CO3: 5,
      SP: "E"
    },
    expected: {
      SA: 92, CE: 83, DC: 100, PP: 83, CO: 83,
      SA_stage: "Future-Ready", CE_stage: "Future-Ready", DC_stage: "Future-Ready", PP_stage: "Future-Ready", CO_stage: "Future-Ready",
      CRI: 88, CRI_stage_no: 5, Cap: 5, Stage_no: 5, Stage: "Future-Ready",
      SP_stage_no: 5,
      F1: false, F2: false, F3: false, F4: false,
      flagCount: 0, lowestDomain: 83,
      baseRiskLevel: 1, finalRiskLevel: 1, finalRisk: "Low"
    }
  },
  {
    caseId: "T6",
    description: "Decided early, under pressure",
    inputs: {
      SA1: 2, SA2: 3, SA3: 2,
      CE1: 2, CE2: 1, CE3: 1,
      DC1: 5, DC2: 1, DC3: 2,
      PP1: 4, PP2: 3, PP3: 2,
      CO1: 4, CO2: 4, CO3: 1,
      SP: "D"
    },
    expected: {
      SA: 33, CE: 8, DC: 92, PP: 50, CO: 33,
      SA_stage: "Confused", CE_stage: "Unaware", DC_stage: "Future-Ready", PP_stage: "Exploring", CO_stage: "Confused",
      CRI: 43, CRI_stage_no: 3, Cap: 4, Stage_no: 3, Stage: "Exploring",
      SP_stage_no: 4,
      F1: true, F2: true, F3: true, F4: false,
      flagCount: 3, lowestDomain: 8,
      baseRiskLevel: 3, finalRiskLevel: 4, finalRisk: "High"
    }
  },
  {
    caseId: "T7",
    description: "Over-rates own readiness",
    inputs: {
      SA1: 3, SA2: 3, SA3: 3,
      CE1: 2, CE2: 2, CE3: 2,
      DC1: 2, DC2: 4, DC3: 4,
      PP1: 2, PP2: 2, PP3: 1,
      CO1: 3, CO2: 3, CO3: 3,
      SP: "E"
    },
    expected: {
      SA: 50, CE: 25, DC: 25, PP: 17, CO: 50,
      SA_stage: "Exploring", CE_stage: "Confused", DC_stage: "Confused", PP_stage: "Unaware", CO_stage: "Exploring",
      CRI: 33, CRI_stage_no: 2, Cap: 3, Stage_no: 2, Stage: "Confused",
      SP_stage_no: 5,
      F1: false, F2: false, F3: false, F4: true,
      flagCount: 1, lowestDomain: 17,
      baseRiskLevel: 4, finalRiskLevel: 4, finalRisk: "High"
    }
  }
];
