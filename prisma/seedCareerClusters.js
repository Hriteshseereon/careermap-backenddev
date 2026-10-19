import prisma from "../src/config/db.js";
import { DEFAULT_CAREER_CLUSTERS, seedCareerClustersToDatabase } from "../src/modules/psychometricassesment/psychoassessment.seed.js";

async function main() {
  console.log("🌱 Starting Career Clusters & Weights seeding...");
  console.log(`Total Clusters to seed: ${DEFAULT_CAREER_CLUSTERS.length}`);

  const results = await seedCareerClustersToDatabase();

  console.log(`✅ Successfully seeded/updated ${results.length} career clusters with full weights:`);
  for (const c of results) {
    console.log(`  - [${c.code}] ${c.name} (Holland: ${c.hollandCode})`);
  }
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
