import prisma from "../src/config/db.js";
import {
  DEFAULT_ASSESSMENT_CONFIG,
  DEFAULT_SECTIONS,
  DEFAULT_QUESTIONS,
  seedAssessmentAndQuestions
} from "../src/modules/psychometricassesment/psychoassessment.questions.seed.js";

async function main() {
  console.log("🌱 Starting Assessment & 163 Questions Seeding...");
  console.log(`Assessment: "${DEFAULT_ASSESSMENT_CONFIG.title}"`);
  console.log(`Total Sections: ${DEFAULT_SECTIONS.length}`);
  console.log(`Total Questions: ${DEFAULT_QUESTIONS.length}`);

  const result = await seedAssessmentAndQuestions();

  console.log("✅ Seeding completed successfully!");
  console.log(`  - Assessment ID: ${result.assessment.id} (${result.assessment.title})`);
  console.log(`  - Sections Seeded: ${result.sectionsCount}`);
  console.log(`  - Questions Seeded: ${result.questionsCount} / 163`);
}

main()
  .catch((err) => {
    console.error("❌ Questions seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
