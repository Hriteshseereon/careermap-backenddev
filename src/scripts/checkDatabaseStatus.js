import "dotenv/config";
import prisma from "../config/db.js";

async function check() {
  try {
    const [streams, categories, secondCategories, subcategories, institutions, users] = await Promise.all([
      prisma.stream.count(),
      prisma.category.count(),
      prisma.secondcategory.count(),
      prisma.subcategory.count(),
      prisma.institutions.count(),
      prisma.users.count(),
    ]);

    console.log("📊 Database Status for Current DATABASE_URL:");
    console.log({
      streams,
      categories,
      secondCategories,
      subcategories,
      institutions,
      users,
    });

    const sampleStreams = await prisma.stream.findMany({ take: 5 });
    console.log("Sample Streams:", sampleStreams);

    const sampleCategories = await prisma.category.findMany({ take: 5 });
    console.log("Sample Categories:", sampleCategories);

  } catch (err) {
    console.error("Database check error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();

