import prisma from "../src/config/db.js";
import {
  PROFILING_QUESTIONS,
  PROFILING_DOMAINS,
  STAGE_BANDS,
  SELF_PLACEMENT_OPTIONS
} from "../src/modules/psychometricassesment/profiling.constants.js";
import { DEFAULT_ASSESSMENT_CONFIG } from "../src/modules/psychometricassesment/psychoassessment.questions.seed.js";

export async function seedProfilingSectionAndQuestions(targetAssessmentId = null) {
  console.log("=================================================");
  console.log("🎯 SEEDING CAREER PLANNING / PROFILING SECTION & QUESTIONS");
  console.log("=================================================");

  // 1. Resolve Target Assessment
  let assessment;
  if (targetAssessmentId) {
    assessment = await prisma.assessment.findUnique({
      where: { id: Number(targetAssessmentId) }
    });
    if (!assessment) {
      throw new Error(`Assessment with ID ${targetAssessmentId} not found`);
    }
  } else {
    // Find published assessment or default config
    assessment = await prisma.assessment.findFirst({
      where: {
        OR: [
          { slug: DEFAULT_ASSESSMENT_CONFIG.slug },
          { status: "published" }
        ]
      }
    });

    if (!assessment) {
      console.log(`ℹ️ No assessment found. Creating default assessment: "${DEFAULT_ASSESSMENT_CONFIG.title}"...`);
      assessment = await prisma.assessment.create({
        data: DEFAULT_ASSESSMENT_CONFIG
      });
    }
  }

  console.log(`📋 Target Assessment: [ID: ${assessment.id}] ${assessment.title} (Slug: ${assessment.slug})`);

  // 2. Upsert Profiling Section
  const profilingSection = await prisma.assessmentSection.upsert({
    where: {
      assessmentId_code: {
        assessmentId: assessment.id,
        code: "profiling"
      }
    },
    update: {
      title: "Career Planning Track / Personal Profiling",
      description: "Places each student on a 5-stage career-planning track (Unaware, Confused, Exploring, Clarity, Future-Ready), evaluates career readiness index (CRI), shows risk level, and provides personalized next steps.",
      order: 1
    },
    create: {
      assessmentId: assessment.id,
      code: "profiling",
      title: "Career Planning Track / Personal Profiling",
      description: "Places each student on a 5-stage career-planning track (Unaware, Confused, Exploring, Clarity, Future-Ready), evaluates career readiness index (CRI), shows risk level, and provides personalized next steps.",
      order: 1
    }
  });

  console.log(`✅ Profiling Section Ready: [ID: ${profilingSection.id}] code: "${profilingSection.code}" (Order: ${profilingSection.order})`);

  // 3. Shift orders of any other existing sections so Profiling is strictly Section 1
  const allSections = await prisma.assessmentSection.findMany({
    where: { assessmentId: assessment.id },
    orderBy: { order: "asc" }
  });

  const sectionOrderMap = {
    profiling: 1,
    interest: 2,
    personality: 3,
    learning_style: 4,
    values: 5,
    goal_orientation: 6,
    aptitude: 7
  };

  for (const s of allSections) {
    const expectedOrder = sectionOrderMap[s.code] || (s.code === "profiling" ? 1 : s.order + 1);
    if (s.order !== expectedOrder) {
      await prisma.assessmentSection.update({
        where: { id: s.id },
        data: { order: expectedOrder }
      });
    }
  }

  // 4. Upsert All 16 Profiling Questions
  const seededQuestions = [];

  for (const q of PROFILING_QUESTIONS) {
    const question = await prisma.assessmentQuestion.upsert({
      where: {
        sectionId_itemId: {
          sectionId: profilingSection.id,
          itemId: q.itemId
        }
      },
      update: {
        text: q.questionText,
        type: q.responseType,
        facet: q.domainCode,
        reverse: Boolean(q.reverseScored),
        order: q.displayOrder,
        note: q.scoringRule || null
      },
      create: {
        sectionId: profilingSection.id,
        itemId: q.itemId,
        text: q.questionText,
        type: q.responseType,
        facet: q.domainCode,
        reverse: Boolean(q.reverseScored),
        order: q.displayOrder,
        note: q.scoringRule || null
      }
    });

    // 5. If question has options (e.g. SP: options A to E), seed options
    if (Array.isArray(q.options) && q.options.length > 0) {
      await prisma.assessmentOption.deleteMany({
        where: { questionId: question.id }
      });

      await prisma.assessmentOption.createMany({
        data: q.options.map((opt, idx) => ({
          questionId: question.id,
          optionText: `${opt.optionKey}. ${opt.text}`,
          optionIndex: opt.stageNo !== undefined ? opt.stageNo : idx + 1,
          isCorrect: false
        }))
      });
    }

    seededQuestions.push(question);
    console.log(`  -> [${q.itemId}] (${q.domainCode}) "${q.questionText.slice(0, 45)}..." (Order: ${q.displayOrder}, Reverse: ${q.reverseScored})`);
  }

  console.log(`\n🎉 Successfully seeded ${seededQuestions.length} Profiling Questions into Assessment ID ${assessment.id}!`);

  return {
    assessmentId: assessment.id,
    section: profilingSection,
    questionsCount: seededQuestions.length,
    questions: seededQuestions
  };
}

// Allow direct CLI execution: `node prisma/seedProfilingQuestions.js`
if (process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("seedProfilingQuestions.js")) {
  seedProfilingSectionAndQuestions()
    .then(() => {
      console.log("✅ Profiling Seeding complete.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Profiling Seeding failed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
