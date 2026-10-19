import prisma from "../src/config/db.js";
import { seedCareerClustersToDatabase } from "../src/modules/psychometricassesment/psychoassessment.seed.js";
import { seedAssessmentAndQuestions } from "../src/modules/psychometricassesment/psychoassessment.questions.seed.js";

async function main() {
  console.log("=================================================");
  console.log("🚀 STARTING COMPLETE PSYCHOMETRIC SEEDING SUITE");
  console.log("=================================================");

  console.log("\n--- 1. Seeding 18 Career Clusters & 21 Weights ---");
  const clusters = await seedCareerClustersToDatabase();
  console.log(`✅ Successfully seeded ${clusters.length} career clusters.`);

  console.log("\n--- 2. Seeding Assessment, 7 Sections & 179 Questions (16 Profiling + 163 Psychometric/Aptitude) ---");
  const questionsResult = await seedAssessmentAndQuestions();
  console.log(`✅ Assessment: [ID: ${questionsResult.assessment.id}] ${questionsResult.assessment.title}`);
  console.log(`✅ Sections: ${questionsResult.sectionsCount}`);
  console.log(`✅ Questions: ${questionsResult.questionsCount}`);

  console.log("\n=================================================");
  console.log("🎉 ALL PSYCHOMETRIC BENCHMARKS & QUESTIONS SEEDED!");
  console.log("=================================================");
}

main()
  .catch((err) => {
    console.error("❌ Master Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
