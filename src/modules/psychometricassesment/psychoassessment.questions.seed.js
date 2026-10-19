import prisma from "../../config/db.js";

export const DEFAULT_ASSESSMENT_CONFIG = {
  title: "Career Compass Standard Psychometric & Aptitude Assessment",
  slug: "career-compass-standard-assessment",
  description: "Comprehensive 6-domain psychometric assessment evaluating RIASEC Interests, Big Five Personality, Work Values, VARK Learning Styles, Goal Orientation, and Core Cognitive Aptitudes for precision career matching.",
  version: "1.0",
  status: "published"
};

export const DEFAULT_SECTIONS = [
  {
    code: "profiling",
    title: "Career Planning Track / Personal Profiling",
    description: "Places each student on a 5-stage career-planning track (Unaware, Confused, Exploring, Clarity, Future-Ready), evaluates career readiness index (CRI), shows risk level, and provides personalized next steps.",
    order: 1
  },
  {
    code: "interest",
    title: "Interest Assessment (RIASEC)",
    description: "Evaluates career interests across Realistic, Investigative, Artistic, Social, Enterprising, and Conventional domains.",
    order: 2
  },
  {
    code: "personality",
    title: "Personality Assessment (Big Five / OCEAN)",
    description: "Evaluates behavioral traits across Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability.",
    order: 3
  },
  {
    code: "learning_style",
    title: "Learning Styles (VARK)",
    description: "Identifies preferred learning modalities across Visual, Auditory, Reading/Writing, and Kinesthetic styles.",
    order: 4
  },
  {
    code: "values",
    title: "Work Values (Schwartz)",
    description: "Evaluates core work values across Openness to Change, Self-Enhancement, Conservation, and Self-Transcendence.",
    order: 5
  },
  {
    code: "goal_orientation",
    title: "Goal Orientation",
    description: "Assesses long-term academic orientation versus short-term workforce entry preferences.",
    order: 6
  },
  {
    code: "aptitude",
    title: "Aptitude & Cognitive Abilities",
    description: "Objective problem-solving assessments across Logical, Vocabulary, Numerical, Mechanical, Verbal, and Spatial reasoning.",
    order: 7
  }
];

export const DEFAULT_QUESTIONS = [
  // ==========================================
  // 0. PROFILING (CAREER PLANNING TRACK / CRI) — 16 items
  // ==========================================
  { sectionCode: "profiling", itemId: "SA1", text: "I know at least three things I really like doing.", facet: "SA", type: "likert5", reverse: false, order: 1 },
  { sectionCode: "profiling", itemId: "SA2", text: "I know which subjects or activities I am good at.", facet: "SA", type: "likert5", reverse: false, order: 2 },
  { sectionCode: "profiling", itemId: "SA3", text: "I know what is important to me in a future job (like good salary, helping people, being creative, or a safe job).", facet: "SA", type: "likert5", reverse: false, order: 3 },
  { sectionCode: "profiling", itemId: "CE1", text: "I know about many careers, not only doctor, engineer, or CA.", facet: "CE", type: "likert5", reverse: false, order: 4 },
  { sectionCode: "profiling", itemId: "CE2", text: "In the last six months, I have searched for information about careers I may like.", facet: "CE", type: "likert5", reverse: false, order: 5 },
  { sectionCode: "profiling", itemId: "CE3", text: "I have talked to someone who works in a field I like, and asked about their work.", facet: "CE", type: "likert5", reverse: false, order: 6 },
  { sectionCode: "profiling", itemId: "DC1", text: "I know which field or career I want to go into.", facet: "DC", type: "likert5", reverse: false, order: 7 },
  { sectionCode: "profiling", itemId: "DC2", text: "I keep changing my mind about which career I want.", facet: "DC", type: "likert5", reverse: true, order: 8 },
  { sectionCode: "profiling", itemId: "DC3", text: "There are so many choices that I don't know which one to pick.", facet: "DC", type: "likert5", reverse: true, order: 9 },
  { sectionCode: "profiling", itemId: "PP1", text: "I know which stream (Science, Commerce, Arts) or subjects I need for the career I want.", facet: "PP", type: "likert5", reverse: false, order: 10 },
  { sectionCode: "profiling", itemId: "PP2", text: "I know which entrance exams, courses, or colleges I need for the career I want.", facet: "PP", type: "likert5", reverse: false, order: 11 },
  { sectionCode: "profiling", itemId: "PP3", text: "I have already started doing something for my career goal (like a course, practice, or a project).", facet: "PP", type: "likert5", reverse: false, order: 12 },
  { sectionCode: "profiling", itemId: "CO1", text: "I believe I can make a good career choice.", facet: "CO", type: "likert5", reverse: false, order: 13 },
  { sectionCode: "profiling", itemId: "CO2", text: "When I think about my career, I feel worried or tense.", facet: "CO", type: "likert5", reverse: true, order: 14 },
  { sectionCode: "profiling", itemId: "CO3", text: "The career I choose will be my own choice, even if I take advice from others.", facet: "CO", type: "likert5", reverse: false, order: 15 },
  {
    sectionCode: "profiling",
    itemId: "SP",
    text: "Pick the one sentence that fits you best:",
    facet: "SP",
    type: "single_choice",
    reverse: false,
    order: 16,
    options: [
      { optionText: "A. I have not really thought about my career yet.", optionIndex: 1, isCorrect: false },
      { optionText: "B. I have thought about it, but I feel confused.", optionIndex: 2, isCorrect: false },
      { optionText: "C. I am looking at a few options and learning more about them.", optionIndex: 3, isCorrect: false },
      { optionText: "D. I know what I want, but I don't know the full path yet.", optionIndex: 4, isCorrect: false },
      { optionText: "E. I know what I want, and I have already started working towards it.", optionIndex: 5, isCorrect: false }
    ]
  },

  // ==========================================
  // 1. INTEREST (RIASEC) — 30 items
  // ==========================================
  { sectionCode: "interest", itemId: "INT01", text: "Using tools to build or fix things.", facet: "R", type: "likert5", reverse: false, order: 1 },
  { sectionCode: "interest", itemId: "INT02", text: "Doing activities that involve working with my hands.", facet: "R", type: "likert5", reverse: false, order: 2 },
  { sectionCode: "interest", itemId: "INT03", text: "Spending time outside, like gardening or exploring nature.", facet: "R", type: "likert5", reverse: false, order: 3 },
  { sectionCode: "interest", itemId: "INT04", text: "Doing physical tasks like lifting or carrying things.", facet: "R", type: "likert5", reverse: false, order: 4 },
  { sectionCode: "interest", itemId: "INT05", text: "Learning how things like machines or gadgets work.", facet: "R", type: "likert5", reverse: false, order: 5 },

  { sectionCode: "interest", itemId: "INT06", text: "Solving puzzles or tricky problems.", facet: "I", type: "likert5", reverse: false, order: 6 },
  { sectionCode: "interest", itemId: "INT07", text: "Doing science experiments to learn new things.", facet: "I", type: "likert5", reverse: false, order: 7 },
  { sectionCode: "interest", itemId: "INT08", text: "Reading books or articles about science.", facet: "I", type: "likert5", reverse: false, order: 8 },
  { sectionCode: "interest", itemId: "INT09", text: "Finding patterns or solutions by looking at data.", facet: "I", type: "likert5", reverse: false, order: 9 },
  { sectionCode: "interest", itemId: "INT10", text: "Exploring topics that interest me.", facet: "I", type: "likert5", reverse: false, order: 10 },

  { sectionCode: "interest", itemId: "INT11", text: "Drawing, painting, or making crafts.", facet: "A", type: "likert5", reverse: false, order: 11 },
  { sectionCode: "interest", itemId: "INT12", text: "Writing stories, poems, or songs.", facet: "A", type: "likert5", reverse: false, order: 12 },
  { sectionCode: "interest", itemId: "INT13", text: "Playing music or singing.", facet: "A", type: "likert5", reverse: false, order: 13 },
  { sectionCode: "interest", itemId: "INT14", text: "Dancing to express myself.", facet: "A", type: "likert5", reverse: false, order: 14 },
  { sectionCode: "interest", itemId: "INT15", text: "Creating my own art projects.", facet: "A", type: "likert5", reverse: false, order: 15 },

  { sectionCode: "interest", itemId: "INT16", text: "Helping my friends with their problems.", facet: "S", type: "likert5", reverse: false, order: 16 },
  { sectionCode: "interest", itemId: "INT17", text: "Working together with others on group projects.", facet: "S", type: "likert5", reverse: false, order: 17 },
  { sectionCode: "interest", itemId: "INT18", text: "Teaching or explaining things to others.", facet: "S", type: "likert5", reverse: false, order: 18 },
  { sectionCode: "interest", itemId: "INT19", text: "Volunteering or doing activities that help others.", facet: "S", type: "likert5", reverse: false, order: 19 },
  { sectionCode: "interest", itemId: "INT20", text: "Leading a group.", facet: "S", type: "likert5", reverse: false, order: 20 },

  { sectionCode: "interest", itemId: "INT21", text: "Taking the lead in organizing activities.", facet: "E", type: "likert5", reverse: false, order: 21 },
  { sectionCode: "interest", itemId: "INT22", text: "Convincing others to agree with my ideas.", facet: "E", type: "likert5", reverse: false, order: 22 },
  { sectionCode: "interest", itemId: "INT23", text: "Planning and making decisions for a team.", facet: "E", type: "likert5", reverse: false, order: 23 },
  { sectionCode: "interest", itemId: "INT24", text: "Taking on challenges to reach my goals.", facet: "E", type: "likert5", reverse: false, order: 24 },
  { sectionCode: "interest", itemId: "INT25", text: "Starting new projects or activities.", facet: "E", type: "likert5", reverse: false, order: 25 },

  { sectionCode: "interest", itemId: "INT26", text: "Organizing things neatly.", facet: "C", type: "likert5", reverse: false, order: 26 },
  { sectionCode: "interest", itemId: "INT27", text: "Maintaining records and keeping track of tasks.", facet: "C", type: "likert5", reverse: false, order: 27 },
  { sectionCode: "interest", itemId: "INT28", text: "Working with numbers or simple financial planning.", facet: "C", type: "likert5", reverse: false, order: 28 },
  { sectionCode: "interest", itemId: "INT29", text: "Keeping notes of activities.", facet: "C", type: "likert5", reverse: false, order: 29 },
  { sectionCode: "interest", itemId: "INT30", text: "Doing tasks that require careful attention.", facet: "C", type: "likert5", reverse: false, order: 30 },

  // ==========================================
  // 2. PERSONALITY (OCEAN) — 30 items
  // ==========================================
  { sectionCode: "personality", itemId: "PER01", text: "I enjoy exploring new ideas and learning about different subjects", facet: "O", type: "likert5", reverse: false, order: 1 },
  { sectionCode: "personality", itemId: "PER02", text: "I like trying out new activities that are different from what I usually do", facet: "O", type: "likert5", reverse: false, order: 2 },
  { sectionCode: "personality", itemId: "PER03", text: "I avoid doing things that are unfamiliar or new to me", facet: "O", type: "likert5", reverse: true, order: 3 },
  { sectionCode: "personality", itemId: "PER04", text: "I am curious and often wonder about how things work", facet: "O", type: "likert5", reverse: false, order: 4 },
  { sectionCode: "personality", itemId: "PER05", text: "I don't like changing my routine or trying new experiences", facet: "O", type: "likert5", reverse: true, order: 5 },
  { sectionCode: "personality", itemId: "PER06", text: "I struggle to engage with topics outside my knowledge", facet: "O", type: "likert5", reverse: true, order: 6 },

  { sectionCode: "personality", itemId: "PER07", text: "I always complete my tasks or homework on time", facet: "Cn", type: "likert5", reverse: false, order: 7 },
  { sectionCode: "personality", itemId: "PER08", text: "I like to stay organized and keep my things in order", facet: "Cn", type: "likert5", reverse: false, order: 8 },
  { sectionCode: "personality", itemId: "PER09", text: "I give my best in everything I do", facet: "Cn", type: "likert5", reverse: false, order: 9 },
  { sectionCode: "personality", itemId: "PER10", text: "I often leave tasks unfinished or forget to do them", facet: "Cn", type: "likert5", reverse: true, order: 10 },
  { sectionCode: "personality", itemId: "PER11", text: "I find it difficult to keep my things clean or organized", facet: "Cn", type: "likert5", reverse: true, order: 11 },
  { sectionCode: "personality", itemId: "PER12", text: "I don't always put much effort into my work or responsibilities", facet: "Cn", type: "likert5", reverse: true, order: 12 },

  { sectionCode: "personality", itemId: "PER13", text: "I enjoy being around others and making new friends", facet: "Ex", type: "likert5", reverse: false, order: 13 },
  { sectionCode: "personality", itemId: "PER14", text: "I feel excited and energized when I'm in a group or social setting", facet: "Ex", type: "likert5", reverse: false, order: 14 },
  { sectionCode: "personality", itemId: "PER15", text: "I like sharing my thoughts with people", facet: "Ex", type: "likert5", reverse: false, order: 15 },
  { sectionCode: "personality", itemId: "PER16", text: "I prefer to be alone rather than with people", facet: "Ex", type: "likert5", reverse: true, order: 16 },
  { sectionCode: "personality", itemId: "PER17", text: "I feel uncomfortable speaking in public", facet: "Ex", type: "likert5", reverse: true, order: 17 },
  { sectionCode: "personality", itemId: "PER18", text: "I find it tiring to be around others for too long", facet: "Ex", type: "likert5", reverse: true, order: 18 },

  { sectionCode: "personality", itemId: "PER19", text: "I am kind and helpful to others", facet: "Ag", type: "likert5", reverse: false, order: 19 },
  { sectionCode: "personality", itemId: "PER20", text: "I enjoy working together with others to solve problems", facet: "Ag", type: "likert5", reverse: false, order: 20 },
  { sectionCode: "personality", itemId: "PER21", text: "I try to get along with everyone and avoid arguments", facet: "Ag", type: "likert5", reverse: false, order: 21 },
  { sectionCode: "personality", itemId: "PER22", text: "I find it hard to care about other people's feelings", facet: "Ag", type: "likert5", reverse: true, order: 22 },
  { sectionCode: "personality", itemId: "PER23", text: "I often argue and don't mind disagreements with others", facet: "Ag", type: "likert5", reverse: true, order: 23 },
  { sectionCode: "personality", itemId: "PER24", text: "I prefer to do things my way", facet: "Ag", type: "likert5", reverse: true, order: 24 },

  { sectionCode: "personality", itemId: "PER25", text: "I stay calm and relaxed, even when things go wrong", facet: "ES", type: "likert5", reverse: false, order: 25 },
  { sectionCode: "personality", itemId: "PER26", text: "I can handle stress without getting too upset", facet: "ES", type: "likert5", reverse: false, order: 26 },
  { sectionCode: "personality", itemId: "PER27", text: "I feel confident and secure in myself most of the time", facet: "ES", type: "likert5", reverse: false, order: 27 },
  { sectionCode: "personality", itemId: "PER28", text: "I often feel restless or worried about things", facet: "ES", type: "likert5", reverse: true, order: 28 },
  { sectionCode: "personality", itemId: "PER29", text: "I get upset easily when things don't go as planned", facet: "ES", type: "likert5", reverse: true, order: 29 },
  { sectionCode: "personality", itemId: "PER30", text: "I struggle to stay calm under pressure", facet: "ES", type: "likert5", reverse: true, order: 30 },

  // ==========================================
  // 3. LEARNING STYLE (VARK) — 20 items
  // ==========================================
  { sectionCode: "learning_style", itemId: "LRN01", text: "I understand lessons better when I see diagrams or pictures", facet: "V", type: "likert5", reverse: false, order: 1 },
  { sectionCode: "learning_style", itemId: "LRN02", text: "I prefer analysing charts or graphs instead of listening to explanations", facet: "V", type: "likert5", reverse: false, order: 2 },
  { sectionCode: "learning_style", itemId: "LRN03", text: "When studying, I like using different colours to highlight important points", facet: "V", type: "likert5", reverse: false, order: 3 },
  { sectionCode: "learning_style", itemId: "LRN04", text: "I remember information better when it is presented in a flowchart or map", facet: "V", type: "likert5", reverse: false, order: 4 },
  { sectionCode: "learning_style", itemId: "LRN05", text: "I find it easier to follow instructions when they are shown as pictures", facet: "V", type: "likert5", reverse: false, order: 5 },

  { sectionCode: "learning_style", itemId: "LRN06", text: "I learn quickly when someone explains things to me verbally", facet: "A", type: "likert5", reverse: false, order: 6 },
  { sectionCode: "learning_style", itemId: "LRN07", text: "I learn better when I discuss things with others", facet: "A", type: "likert5", reverse: false, order: 7 },
  { sectionCode: "learning_style", itemId: "LRN08", text: "Listening to recordings or podcasts helps me remember information", facet: "A", type: "likert5", reverse: false, order: 8 },
  { sectionCode: "learning_style", itemId: "LRN09", text: "I enjoy listening to lectures more than reading textbooks", facet: "A", type: "likert5", reverse: false, order: 9 },
  { sectionCode: "learning_style", itemId: "LRN10", text: "Step-by-step instructions given verbally help me understand better", facet: "A", type: "likert5", reverse: false, order: 10 },

  { sectionCode: "learning_style", itemId: "LRN11", text: "I prefer taking notes and reading them to learn new things", facet: "Rd", type: "likert5", reverse: false, order: 11 },
  { sectionCode: "learning_style", itemId: "LRN12", text: "I enjoy reading stories, articles, or essays to explore new ideas", facet: "Rd", type: "likert5", reverse: false, order: 12 },
  { sectionCode: "learning_style", itemId: "LRN13", text: "Reading textbooks or articles helps me understand information quickly", facet: "Rd", type: "likert5", reverse: false, order: 13 },
  { sectionCode: "learning_style", itemId: "LRN14", text: "I like organizing my thoughts by writing them in a journal or notebook", facet: "Rd", type: "likert5", reverse: false, order: 14 },
  { sectionCode: "learning_style", itemId: "LRN15", text: "I find it easier to learn when I read instructions carefully", facet: "Rd", type: "likert5", reverse: false, order: 15 },

  { sectionCode: "learning_style", itemId: "LRN16", text: "I understand concepts better when I do practical activities", facet: "K", type: "likert5", reverse: false, order: 16 },
  { sectionCode: "learning_style", itemId: "LRN17", text: "I prefer learning by trying things out rather than just reading about them", facet: "K", type: "likert5", reverse: false, order: 17 },
  { sectionCode: "learning_style", itemId: "LRN18", text: "I remember things better when I move around or use signs and signals while learning", facet: "K", type: "likert5", reverse: false, order: 18 },
  { sectionCode: "learning_style", itemId: "LRN19", text: "I learn best when I can touch and work with objects physically", facet: "K", type: "likert5", reverse: false, order: 19 },
  { sectionCode: "learning_style", itemId: "LRN20", text: "I find practical experiments more interesting than listening to lectures", facet: "K", type: "likert5", reverse: false, order: 20 },

  // ==========================================
  // 4. VALUES (SCHWARTZ) — 37 items
  // ==========================================
  { sectionCode: "values", itemId: "VAL01", text: "I like trying new things, even if they are challenging", facet: "OC", type: "likert5", reverse: false, order: 1 },
  { sectionCode: "values", itemId: "VAL02", text: "I enjoy bringing my own ideas and projects", facet: "OC", type: "likert5", reverse: false, order: 2 },
  { sectionCode: "values", itemId: "VAL03", text: "I prefer working on tasks where I can be creative", facet: "OC", type: "likert5", reverse: false, order: 3 },
  { sectionCode: "values", itemId: "VAL04", text: "I like to make my own decisions", facet: "OC", type: "likert5", reverse: false, order: 4 },
  { sectionCode: "values", itemId: "VAL05", text: "I enjoy exploring new places and learning new things", facet: "OC", type: "likert5", reverse: false, order: 5 },
  { sectionCode: "values", itemId: "VAL06", text: "I like tasks that allow me to think in different ways", facet: "OC", type: "likert5", reverse: false, order: 6 },
  { sectionCode: "values", itemId: "VAL07", text: "I enjoy taking on new challenges that are different from what I usually do", facet: "OC", type: "likert5", reverse: false, order: 7 },
  { sectionCode: "values", itemId: "VAL08", text: "I enjoy doing things differently", facet: "OC", type: "likert5", reverse: false, order: 8 },
  { sectionCode: "values", itemId: "VAL09", text: "I prefer having the freedom to choose how I do my work", facet: "OC", type: "likert5", reverse: false, order: 9 },

  { sectionCode: "values", itemId: "VAL10", text: "I try to be the best in what I do", facet: "SE", type: "likert5", reverse: false, order: 10 },
  { sectionCode: "values", itemId: "VAL11", text: "I like being recognized for my achievements", facet: "SE", type: "likert5", reverse: false, order: 11 },
  { sectionCode: "values", itemId: "VAL12", text: "I enjoy setting goals and working hard to achieve them", facet: "SE", type: "likert5", reverse: false, order: 12 },
  { sectionCode: "values", itemId: "VAL13", text: "I want to be in a position where I can make important decisions", facet: "SE", type: "likert5", reverse: false, order: 13 },
  { sectionCode: "values", itemId: "VAL14", text: "I feel proud when I accomplish something difficult", facet: "SE", type: "likert5", reverse: false, order: 14 },
  { sectionCode: "values", itemId: "VAL15", text: "I like to be in charge of group projects or activities", facet: "SE", type: "likert5", reverse: false, order: 15 },
  { sectionCode: "values", itemId: "VAL16", text: "I enjoy being a leader and guiding others", facet: "SE", type: "likert5", reverse: false, order: 16 },
  { sectionCode: "values", itemId: "VAL17", text: "I want to be successful and have a good reputation", facet: "SE", type: "likert5", reverse: false, order: 17 },
  { sectionCode: "values", itemId: "VAL18", text: "I like to show others that I am capable and skilled", facet: "SE", type: "likert5", reverse: false, order: 18 },
  { sectionCode: "values", itemId: "VAL19", text: "I feel motivated when I have the chance to win or excel", facet: "SE", type: "likert5", reverse: false, order: 19 },

  { sectionCode: "values", itemId: "VAL20", text: "I feel confident when I follow rules and do what is expected", facet: "CO", type: "likert5", reverse: false, order: 20 },
  { sectionCode: "values", itemId: "VAL21", text: "I like to keep things in order and make sure everything is secure", facet: "CO", type: "likert5", reverse: false, order: 21 },
  { sectionCode: "values", itemId: "VAL22", text: "I try to avoid doing things that might upset others", facet: "CO", type: "likert5", reverse: false, order: 22 },
  { sectionCode: "values", itemId: "VAL23", text: "I feel comfortable when things stay the same and don't change too much", facet: "CO", type: "likert5", reverse: false, order: 23 },
  { sectionCode: "values", itemId: "VAL24", text: "I believe it is important to follow the rules and regulations", facet: "CO", type: "likert5", reverse: false, order: 24 },
  { sectionCode: "values", itemId: "VAL25", text: "I like being in environments where I know what to expect", facet: "CO", type: "likert5", reverse: false, order: 25 },
  { sectionCode: "values", itemId: "VAL26", text: "I think it's important to be polite and respectful to everyone", facet: "CO", type: "likert5", reverse: false, order: 26 },
  { sectionCode: "values", itemId: "VAL27", text: "I value stability and like to keep things predictable", facet: "CO", type: "likert5", reverse: false, order: 27 },

  { sectionCode: "values", itemId: "VAL28", text: "I enjoy helping others when they need support", facet: "ST", type: "likert5", reverse: false, order: 28 },
  { sectionCode: "values", itemId: "VAL29", text: "I try to make sure everyone is treated fairly", facet: "ST", type: "likert5", reverse: false, order: 29 },
  { sectionCode: "values", itemId: "VAL30", text: "I feel happy when I can make someone's day better", facet: "ST", type: "likert5", reverse: false, order: 30 },
  { sectionCode: "values", itemId: "VAL31", text: "I believe it's important to protect the environment and nature", facet: "ST", type: "likert5", reverse: false, order: 31 },
  { sectionCode: "values", itemId: "VAL32", text: "I try to be kind and considerate to everyone I meet", facet: "ST", type: "likert5", reverse: false, order: 32 },
  { sectionCode: "values", itemId: "VAL33", text: "I feel good when I help my friends with their problems", facet: "ST", type: "likert5", reverse: false, order: 33 },
  { sectionCode: "values", itemId: "VAL34", text: "I believe it's important to support people who are being treated unfairly", facet: "ST", type: "likert5", reverse: false, order: 34 },
  { sectionCode: "values", itemId: "VAL35", text: "I enjoy doing things that benefit the community or the world", facet: "ST", type: "likert5", reverse: false, order: 35 },
  { sectionCode: "values", itemId: "VAL36", text: "I think it is important to understand and respect people who are different from me", facet: "ST", type: "likert5", reverse: false, order: 36 },
  { sectionCode: "values", itemId: "VAL37", text: "I feel a sense of responsibility to take care of others", facet: "ST", type: "likert5", reverse: false, order: 37 },

  // ==========================================
  // 5. GOAL ORIENTATION — 7 items
  // ==========================================
  { sectionCode: "goal_orientation", itemId: "GOL01", text: "I am committed to a career that requires advanced degrees, so I am willing to spend several more years in school to achieve that goal", facet: "L", type: "likert5", reverse: false, order: 1 },
  { sectionCode: "goal_orientation", itemId: "GOL02", text: "I feel that gaining practical work experience quickly is more important than pursuing a lengthy educational program", facet: "S", type: "likert5", reverse: false, order: 2 },
  { sectionCode: "goal_orientation", itemId: "GOL03", text: "I am open to taking student loans or seeking financial aid to fund my education for a specialized career path", facet: "L", type: "likert5", reverse: false, order: 3 },
  { sectionCode: "goal_orientation", itemId: "GOL04", text: "I would rather start working immediately and gain experience on the job, rather than spending additional years for education", facet: "S", type: "likert5", reverse: false, order: 4 },
  { sectionCode: "goal_orientation", itemId: "GOL05", text: "I am ready to invest time and money in further education if it means having better job opportunities in the future", facet: "L", type: "likert5", reverse: false, order: 5 },
  { sectionCode: "goal_orientation", itemId: "GOL06", text: "I am willing to opt for a part-time job or take on internships during my studies to gain experience while pursuing my long-term career goals", facet: "L", type: "likert5", reverse: false, order: 6 },
  { sectionCode: "goal_orientation", itemId: "GOL07", text: "I am interested in finding a job right after college, even if it means starting in a position that doesn't require a lot of education", facet: "S", type: "likert5", reverse: false, order: 7 },

  // ==========================================
  // 6. APTITUDE (COGNITIVE ABILITIES) — 39 items
  // ==========================================
  {
    sectionCode: "aptitude", itemId: "APT01", facet: "Log", type: "mcq", order: 1, reverse: false,
    text: "In a class of 30 students, 20 have taken Mathematics, 15 have taken Physics, and 10 have taken both. How many students have taken neither Mathematics nor Physics?",
    options: [
      { optionText: "5", isCorrect: true },
      { optionText: "10", isCorrect: false },
      { optionText: "20", isCorrect: false },
      { optionText: "None of the above", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT02", facet: "Log", type: "mcq", order: 2, reverse: false,
    text: "A man is facing north. He turns 90° clockwise, then 180° anti-clockwise, then 90° to his left side, then another 45° to his right-hand side. Which direction is he facing now?",
    options: [
      { optionText: "North East", isCorrect: false },
      { optionText: "South West", isCorrect: true },
      { optionText: "East", isCorrect: false },
      { optionText: "West", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT03", facet: "Log", type: "mcq", order: 3, reverse: false,
    text: "If TRAIN is coded as WUDLQ, how will PLANE be coded?",
    options: [
      { optionText: "SMDQH", isCorrect: false },
      { optionText: "SMDOF", isCorrect: false },
      { optionText: "SODQH", isCorrect: true },
      { optionText: "SODMH", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT04", facet: "Log", type: "mcq", order: 4, reverse: false,
    text: "If it was a Sunday on 11 June 2017, what was the day of the week on 26 November 2017?",
    options: [
      { optionText: "Monday", isCorrect: false },
      { optionText: "Tuesday", isCorrect: false },
      { optionText: "Sunday", isCorrect: true },
      { optionText: "Friday", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT05", facet: "Log", type: "mcq", order: 5, reverse: false,
    text: "Kabir's father is Raj. Raj's brother is Sahil. Sahil's son is Amir. How is Kabir related to Amir?",
    options: [
      { optionText: "Cousin", isCorrect: true },
      { optionText: "Brother", isCorrect: false },
      { optionText: "Uncle", isCorrect: false },
      { optionText: "Nephew", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT06", facet: "Log", type: "mcq", order: 6, reverse: false,
    text: "Refer to the alphanumeric series given below and answer the following question: 7 O * E B # I 9 P U % K Z $ A 0 — How many vowels in the above arrangement are preceded by a symbol?",
    options: [
      { optionText: "One", isCorrect: false },
      { optionText: "Two", isCorrect: false },
      { optionText: "Three", isCorrect: true },
      { optionText: "None", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT07", facet: "Voc", type: "mcq", order: 7, reverse: false,
    text: "Complete the following sentences by supplying appropriate connecting words: 'Youth is the time ___ the seeds of character are sown.'",
    options: [
      { optionText: "When", isCorrect: true },
      { optionText: "Where", isCorrect: false },
      { optionText: "Which", isCorrect: false },
      { optionText: "That", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT08", facet: "Voc", type: "mcq", order: 8, reverse: false,
    text: "'I told him that he was not working hard.' — Find the most suitable statement that expresses this in direct speech.",
    options: [
      { optionText: "I told him, \"You were not working hard.\"", isCorrect: false },
      { optionText: "I said to him, \"He is not working hard.\"", isCorrect: false },
      { optionText: "I said, \"You are not working hard.\"", isCorrect: false },
      { optionText: "I said to him, \"You are not working hard.\"", isCorrect: true }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT09", facet: "Voc", type: "mcq", order: 9, reverse: false,
    text: "The Internet has revolutionized communication, making information accessible at lightning speed. However, this ease of access has raised concerns about privacy and misinformation. _ Which of the following best describes the main idea of the passage?",
    options: [
      { optionText: "The Internet has made personal privacy stronger than before.", isCorrect: false },
      { optionText: "The Internet provides rapid access to information but poses challenges like privacy concerns.", isCorrect: true },
      { optionText: "The Internet spreads misinformation intentionally.", isCorrect: false },
      { optionText: "Communication has remained unchanged despite technological advancements.", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT10", facet: "Voc", type: "mcq", order: 10, reverse: false,
    text: "Identify the grammatically correct sentence:",
    options: [
      { optionText: "Each of the students have a book.", isCorrect: false },
      { optionText: "Neither of the answers were correct.", isCorrect: false },
      { optionText: "The team has decided to postpone its meeting.", isCorrect: true },
      { optionText: "He don't know the answer to the question.", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT11", facet: "Voc", type: "mcq", order: 11, reverse: false,
    text: "Find the incorrect part in this sentence: 'Barely had he arrived to the office when the phone rang.'",
    options: [
      { optionText: "Barely", isCorrect: false },
      { optionText: "had he", isCorrect: false },
      { optionText: "arrived to the office", isCorrect: true },
      { optionText: "when the phone rang", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT12", facet: "Voc", type: "mcq", order: 12, reverse: false,
    text: "Identify the word that is most similar in meaning to \"Ubiquitous\":",
    options: [
      { optionText: "Rare", isCorrect: false },
      { optionText: "Widespread", isCorrect: true },
      { optionText: "Unique", isCorrect: false },
      { optionText: "Specific", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT13", facet: "Num", type: "mcq", order: 13, reverse: false,
    text: "In a Adidas store, the profit is 220% of the cost. If the cost increases by 10% but the selling price remains constant, approximately what percentage of the selling price is the profit?",
    options: [
      { optionText: "66", isCorrect: true },
      { optionText: "54", isCorrect: false },
      { optionText: "60", isCorrect: false },
      { optionText: "76", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT14", facet: "Num", type: "mcq", order: 14, reverse: false,
    text: "Binay and surjay travels from point X to Y at a speed of 17 km/hr and 19 km/hr respectively. point X and Y are 72 km away from each other. Surjay reaches Y first and returns immediately and meets Binay at Z. Find the distance between Z to Y.",
    options: [
      { optionText: "4", isCorrect: true },
      { optionText: "6", isCorrect: false },
      { optionText: "7", isCorrect: false },
      { optionText: "5", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT15", facet: "Num", type: "mcq", order: 15, reverse: false,
    text: "In what time does a sum of money becomes 4.2 times of itself at simple interest rate is 16% per annum?",
    options: [
      { optionText: "15 years", isCorrect: false },
      { optionText: "20 years", isCorrect: true },
      { optionText: "30 years", isCorrect: false },
      { optionText: "None of the above", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT16", facet: "Num", type: "mcq", order: 16, reverse: false,
    text: "A and B can complete a piece of work in 21 and 28 days respectively. They contracted to complete the work for 49000 rupees. The share of B in the contracted money will be?",
    options: [
      { optionText: "₹28,000", isCorrect: false },
      { optionText: "₹24,000", isCorrect: false },
      { optionText: "₹23,000", isCorrect: false },
      { optionText: "₹21,000", isCorrect: true }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT17", facet: "Num", type: "mcq", order: 17, reverse: false,
    text: "Evaluate the sum of the first 50 natural numbers.",
    options: [
      { optionText: "1175", isCorrect: false },
      { optionText: "1275", isCorrect: true },
      { optionText: "1325", isCorrect: false },
      { optionText: "1375", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT18", facet: "Num", type: "mcq", order: 18, reverse: false,
    text: "If p(x) = x² − 5x + 6, find p(2).",
    options: [
      { optionText: "0", isCorrect: true },
      { optionText: "2", isCorrect: false },
      { optionText: "4", isCorrect: false },
      { optionText: "-1", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT19", facet: "Num", type: "mcq", order: 19, reverse: false,
    text: "If a product of two numbers is 120 and their sum is 26, find the numbers.",
    options: [
      { optionText: "12 and 10", isCorrect: false },
      { optionText: "15 and 11", isCorrect: false },
      { optionText: "20 and 6", isCorrect: true },
      { optionText: "24 and 2", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT20", facet: "Mech", type: "mcq", order: 20, reverse: false,
    text: "If bar X moves to the left, which way will bar Y move?",
    note: "Image-based mechanism question",
    image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794468/20q.png",
    options: [
      { optionText: "Left", isCorrect: false },
      { optionText: "Right", isCorrect: true },
      { optionText: "Will not move", isCorrect: false },
      { optionText: "Data is not sufficient", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT21", facet: "Mech", type: "mcq", order: 21, reverse: false,
    text: "What type of initial energy is converted to kinetic energy when a car accelerates?",
    options: [
      { optionText: "Chemical", isCorrect: true },
      { optionText: "Kinetic", isCorrect: false },
      { optionText: "Thermal", isCorrect: false },
      { optionText: "Electrical", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT22", facet: "Mech", type: "mcq", order: 22, reverse: false,
    text: "A person uses a single fixed pulley to lift a box weighing 150 kg. How much force does the person need to apply if the pulley is ideal and there is no friction?",
    options: [
      { optionText: "150 N", isCorrect: false },
      { optionText: "1000 N", isCorrect: false },
      { optionText: "1500 N", isCorrect: false },
      { optionText: "1470 N", isCorrect: true }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT23", facet: "Mech", type: "mcq", order: 23, reverse: false,
    text: "What would be the current flowing through point X if another identical power source were to be added in parallel to the circuit? ",
    note: "Circuit diagram question",
    image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794808/23q.png",
    options: [
      { optionText: "Twice as strong", isCorrect: false },
      { optionText: "Half as strong", isCorrect: false },
      { optionText: "There is no difference", isCorrect: true },
      { optionText: "Not enough data", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT24", facet: "Mech", type: "mcq", order: 24, reverse: false,
    text: "In a simple pulley system, a load of 100 N is lifted by applying a force of 50 N. What is the mechanical advantage of the pulley system? ",
    options: [
      { optionText: "1", isCorrect: false },
      { optionText: "2", isCorrect: true },
      { optionText: "4", isCorrect: false },
      { optionText: "0.5", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT25", facet: "Mech", type: "mcq", order: 25, reverse: false,
    text: "A seesaw is balanced on a fulcrum in the middle. If a boy weighing 40 kg sits 2 metres from the fulcrum on one side, where should another boy weighing 30 kg sit on the other side to balance the seesaw? ",
    options: [
      { optionText: "2.67", isCorrect: true },
      { optionText: "3.55", isCorrect: false },
      { optionText: "1.53", isCorrect: false },
      { optionText: "2.00", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT26", facet: "Verb", type: "mcq", order: 26, reverse: false,
    text: "Arrange the following words to form the most meaningful sentence: widespread / has / in / modern / technology / society / a / impact",
    options: [
      { optionText: "Modern society has a widespread impact in technology.", isCorrect: false },
      { optionText: "Technology has a widespread impact in modern society.", isCorrect: true },
      { optionText: "Modern technology in society has a widespread impact.", isCorrect: false },
      { optionText: "Society has a widespread impact in modern technology.", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT27", facet: "Verb", type: "mcq", order: 27, reverse: false,
    text: "Given below are five sentences S1, P, Q, R and S that make a paragraph. The sentences making the paragraph have been jumbled randomly, only the first sentence\nS1 is at its right place. Find out the correct sequence in which P, Q, R and S should follow after S1 so that a coherent and meaningful paragraph is made.\n\nS1: The discovery of penicillin marked a turning point in medical history.\n\nP. This discovery eventually led to the development of antibiotics.\nQ. It was the first time that bacteria-caused infections could be effectively treated.\nR. Penicillin was discovered by Alexander Fleming in 1928.\nS. Before this, infections were often fatal due to lack of effective treatments.",
    options: [
      { optionText: "RQPS", isCorrect: false },
      { optionText: "RQSP", isCorrect: false },
      { optionText: "RSQP", isCorrect: true },
      { optionText: "QSPR", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT28", facet: "Verb", type: "mcq", order: 28, reverse: false,
    text: "Select the sentence that uses the word 'apprehensive' correctly.",
    options: [
      { optionText: "She felt apprehensive before her first day at the new school.", isCorrect: true },
      { optionText: "The apprehensive sun shone brightly over the clear blue sky.", isCorrect: false },
      { optionText: "He cooked the meal with apprehensive ingredients from the garden.", isCorrect: false },
      { optionText: "The car drove apprehensive down the road at high speed.", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT29", facet: "Verb", type: "mcq", order: 29, reverse: false,
    text: "Statement: \"All successful students plan their studies well in advance. Those who procrastinate often face difficulties in exams.\"\nWhich of the following conclusions can be drawn from the above statement?",
    options: [
      { optionText: "Students who plan never face any difficulties in life.", isCorrect: false },
      { optionText: "Planning is essential for academic success.", isCorrect: true },
      { optionText: "Only successful students plan their studies.", isCorrect: false },
      { optionText: "Students who plan their studies never face difficulties.", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT30", facet: "Verb", type: "mcq", order: 30, reverse: false,
    text: "Wisdom is to wise as strength is to ___.",
    options: [
      { optionText: "Strong", isCorrect: true },
      { optionText: "Strengthen", isCorrect: false },
      { optionText: "Weak", isCorrect: false },
      { optionText: "Strife", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT31", facet: "Verb", type: "mcq", order: 31, reverse: false,
    text: "Consider the following statements:\n\"All cats are mammals.\"\n\"Some mammals are not dogs.\"\n\"All dogs are animals.\"\n\nWhich of the following conclusions can be logically drawn?",
    options: [
      { optionText: "All cats are dogs.", isCorrect: false },
      { optionText: "Some animals are not dogs.", isCorrect: true },
      { optionText: "All mammals are cats.", isCorrect: false },
      { optionText: "Some dogs are not mammals.", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT32", facet: "Verb", type: "mcq", order: 32, reverse: false,
    text: "Cryptic is to Mysterious as Transparent is to ___.",
    options: [
      { optionText: "Opaque", isCorrect: false },
      { optionText: "Clear", isCorrect: true },
      { optionText: "Foggy", isCorrect: false },
      { optionText: "Hidden", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT33", facet: "Spat", type: "mcq", order: 33, reverse: false,
    text: "Minimum number of cuts to divide a round cake into 8 equal pieces:",
    options: [
      { optionText: "2", isCorrect: false },
      { optionText: "3", isCorrect: true },
      { optionText: "4", isCorrect: false },
      { optionText: "5", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT34", facet: "Spat", type: "mcq", order: 34, reverse: false,
    text: "Which figure is identical to the first figure given below?",
    note: "Image figure matching question",
    image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794847/34q.png",
    options: [
      { optionText: "A", isCorrect: false },
      { optionText: "B", isCorrect: false },
      { optionText: "C", isCorrect: false },
      { optionText: "D", isCorrect: true }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT35", facet: "Spat", type: "mcq", order: 35, reverse: false,
    text: "If the picture below is rotated, which one of the following options is the result of the rotation?",
    note: "Mental rotation figure question",
    image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794882/35q.png",
    options: [
      { optionText: "Figure 1", image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794978/35op1.png", isCorrect: false },
      { optionText: "Figure 2", image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794997/35op2.png", isCorrect: false },
      { optionText: "Figure 3", image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789795019/35op3.png", isCorrect: true },
      { optionText: "Figure 4", image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789795039/35op4.png", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT36", facet: "Spat", type: "mcq", order: 36, reverse: false,
    text: "These are different views of the same cube. What colour is the bottom of the middle cube?",
    note: "Cube folding visual problem",
    image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794909/36q.png",
    options: [
      { optionText: "Blue", isCorrect: false },
      { optionText: "Red", isCorrect: false },
      { optionText: "Orange", isCorrect: false },
      { optionText: "Green", isCorrect: true }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT37", facet: "Spat", type: "mcq", order: 37, reverse: false,
    text: "Find the missing part to complete the image.",
    note: "Pattern matrix completion problem",
    image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794932/37q.png",
    options: [
      { optionText: "Option 1", isCorrect: true },
      { optionText: "Option 2", isCorrect: false },
      { optionText: "Option 3", isCorrect: false },
      { optionText: "Option 4", isCorrect: false },
      { optionText: "Option 5", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT38", facet: "Spat", type: "mcq", order: 38, reverse: false,
    text: "A cube is painted on all sides and then cut into smaller cubes. If the original cube is cut into 64 smaller cubes, how many of these smaller cubes will have exactly one face painted?",
    options: [
      { optionText: "24", isCorrect: true },
      { optionText: "26", isCorrect: false },
      { optionText: "22", isCorrect: false },
      { optionText: "20", isCorrect: false }
    ]
  },
  {
    sectionCode: "aptitude", itemId: "APT39", facet: "Spat", type: "mcq", order: 39, reverse: false,
    text: "Which figure completes the statement?",
    note: "Visual analogy problem",
    image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794953/39q.png",
    options: [
      { optionText: "A", isCorrect: false },
      { optionText: "B", isCorrect: false },
      { optionText: "C", isCorrect: false },
      { optionText: "D", isCorrect: true }
    ]
  }
];

export async function seedAssessmentAndQuestions(targetAssessmentId = null) {
  // 1. Get or Create Standard Assessment
  let assessment;
  if (targetAssessmentId) {
    assessment = await prisma.assessment.findUnique({
      where: { id: Number(targetAssessmentId) }
    });
  }

  if (!assessment) {
    assessment = await prisma.assessment.upsert({
      where: { slug: DEFAULT_ASSESSMENT_CONFIG.slug },
      update: {
        title: DEFAULT_ASSESSMENT_CONFIG.title,
        description: DEFAULT_ASSESSMENT_CONFIG.description,
        version: DEFAULT_ASSESSMENT_CONFIG.version,
        status: DEFAULT_ASSESSMENT_CONFIG.status
      },
      create: {
        title: DEFAULT_ASSESSMENT_CONFIG.title,
        slug: DEFAULT_ASSESSMENT_CONFIG.slug,
        description: DEFAULT_ASSESSMENT_CONFIG.description,
        version: DEFAULT_ASSESSMENT_CONFIG.version,
        status: DEFAULT_ASSESSMENT_CONFIG.status
      }
    });
  }

  // 2. Upsert All 6 Sections
  const sectionMap = {};
  for (const s of DEFAULT_SECTIONS) {
    const section = await prisma.assessmentSection.upsert({
      where: {
        assessmentId_code: {
          assessmentId: assessment.id,
          code: s.code
        }
      },
      update: {
        title: s.title,
        description: s.description,
        order: s.order
      },
      create: {
        assessmentId: assessment.id,
        code: s.code,
        title: s.title,
        description: s.description,
        order: s.order
      }
    });
    sectionMap[s.code] = section;
  }

  // 3. Upsert All 163 Questions & Options
  const seededQuestions = [];

  for (const q of DEFAULT_QUESTIONS) {
    const section = sectionMap[q.sectionCode];
    if (!section) continue;

    const question = await prisma.assessmentQuestion.upsert({
      where: {
        sectionId_itemId: {
          sectionId: section.id,
          itemId: q.itemId
        }
      },
      update: {
        text: q.text,
        type: q.type,
        facet: q.facet,
        reverse: Boolean(q.reverse),
        image: q.image || null,
        note: q.note || null,
        order: q.order
      },
      create: {
        sectionId: section.id,
        itemId: q.itemId,
        text: q.text,
        type: q.type,
        facet: q.facet,
        reverse: Boolean(q.reverse),
        image: q.image || null,
        note: q.note || null,
        order: q.order
      }
    });

    // Handle Options (for MCQ and Single Choice)
    if (Array.isArray(q.options) && q.options.length > 0) {
      await prisma.assessmentOption.deleteMany({
        where: { questionId: question.id }
      });

      await prisma.assessmentOption.createMany({
        data: q.options.map((opt, idx) => ({
          questionId: question.id,
          optionText: opt.optionText,
          optionIndex: typeof opt.optionIndex === "number" ? opt.optionIndex : idx + 1,
          isCorrect: Boolean(opt.isCorrect),
          image: opt.image || null
        }))
      });
    }

    seededQuestions.push(question);
  }

  return {
    assessment,
    sectionsCount: Object.keys(sectionMap).length,
    questionsCount: seededQuestions.length
  };
}
