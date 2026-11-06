import "dotenv/config";
import prisma from "../config/db.js";
import { mysqlConnection } from "../migration/config/mysql.js";

async function check() {
  console.log("==========================================================");
  console.log("🔍 CHECKING PATH TYPE & CAREER PATH MAPPING");
  console.log("==========================================================\n");

  // 1. PostgreSQL PathTypes
  try {
    const pgPathTypes = await prisma.pathType.findMany({
      orderBy: { id: "asc" },
    });
    console.log("🐘 PostgreSQL PathType Records:");
    console.table(pgPathTypes);

    // PostgreSQL CareerPaths count grouped by pathId
    const pgCareerPathStats = await prisma.careerPath.groupBy({
      by: ["pathId"],
      _count: { id: true },
    });
    console.log("\n🐘 PostgreSQL CareerPath counts by pathId:");
    console.table(pgCareerPathStats);
  } catch (err) {
    console.error("PostgreSQL Query Error:", err.message);
  }

  // 2. MySQL PathTypes & Paths (if accessible)
  try {
    console.log("\n🐬 Checking MySQL (Legacy DB)...");
    const [mysqlPathTypes] = await mysqlConnection.query("SELECT * FROM path_types ORDER BY id ASC");
    console.log("🐬 MySQL path_types:");
    console.table(mysqlPathTypes);

    const [mysqlPathStats] = await mysqlConnection.query(
      "SELECT pathtype_id, COUNT(*) as count FROM paths GROUP BY pathtype_id ORDER BY pathtype_id ASC"
    );
    console.log("\n🐬 MySQL paths count by pathtype_id:");
    console.table(mysqlPathStats);

    const [samplePaths] = await mysqlConnection.query(
      "SELECT id, pathtype_id, graduation, after_graduation FROM paths LIMIT 5"
    );
    console.log("\n🐬 Sample MySQL paths rows:");
    console.table(samplePaths);

  } catch (err) {
    console.warn("⚠️ MySQL Connection Notice (if offline, will check PG only):", err.message);
  } finally {
    await prisma.$disconnect();
    try {
      await mysqlConnection.end();
    } catch {}
  }
}

check();

