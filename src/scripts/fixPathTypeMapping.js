import "dotenv/config";
import prisma from "../config/db.js";
import { mysqlConnection } from "../migration/config/mysql.js";

const normalize = (str) => {
  if (!str) return "";
  return String(str).trim().toLowerCase().replace(/\s+/g, " ");
};

async function fixPathTypeMapping() {
  console.log("==========================================================");
  console.log("🔧 FIXING PATHTYPE & CAREER PATH RELATION MAPPING");
  console.log("==========================================================\n");

  try {
    // 1. Ensure PathTypes exist in PostgreSQL
    console.log("🐘 Step 1: Checking PostgreSQL PathType records...");
    let pgPathTypes = await prisma.pathType.findMany({ orderBy: { id: "asc" } });

    // The 10 standard path titles
    const standardPathTitles = [
      "Path 1", "Path 2", "Path 3", "Path 4", "Path 5",
      "Path 6", "Path 7", "Path 8", "Path 9", "Path 10"
    ];

    if (pgPathTypes.length === 0) {
      console.log("   PathType table is empty. Creating Path 1 through Path 10...");
      for (const title of standardPathTitles) {
        await prisma.pathType.create({ data: { pathtype: title } });
      }
      pgPathTypes = await prisma.pathType.findMany({ orderBy: { id: "asc" } });
    }

    console.log(`   Found ${pgPathTypes.length} PathType records in PostgreSQL:`);
    console.table(pgPathTypes.map(p => ({ id: p.id, pathtype: p.pathtype })));

    // Map: normalized title (e.g. "path 1") -> PostgreSQL PathType.id
    const titleToPgId = new Map();
    for (const pt of pgPathTypes) {
      if (pt.pathtype) {
        titleToPgId.set(normalize(pt.pathtype), pt.id);
      }
    }

    // 2. Load MySQL path_types & paths
    console.log("\n🐬 Step 2: Fetching legacy MySQL Path Types & Paths...");
    const [mysqlPathTypes] = await mysqlConnection.query("SELECT id, title FROM path_types ORDER BY id ASC");
    console.table(mysqlPathTypes);

    // Build map: MySQL pathtype_id -> PostgreSQL PathType.id
    // e.g. MySQL 3 ("Path 1") -> PG id of "Path 1"
    const mysqlIdToPgId = new Map();
    for (const mpt of mysqlPathTypes) {
      const normTitle = normalize(mpt.title);
      const pgId = titleToPgId.get(normTitle);
      if (pgId) {
        mysqlIdToPgId.set(mpt.id, pgId);
        console.log(`   ✅ MySQL ID ${mpt.id} ("${mpt.title}") ➔ PostgreSQL PathType ID ${pgId}`);
      } else {
        console.warn(`   ⚠️ No matching PostgreSQL PathType found for "${mpt.title}"`);
      }
    }

    // 3. Fetch MySQL paths
    const [mysqlPaths] = await mysqlConnection.query(
      "SELECT id, pathtype_id, graduation, after_graduation, after_pgraduation FROM paths"
    );
    console.log(`\n   Total MySQL paths: ${mysqlPaths.length}`);

    // Map: mysqlPathId -> mysqlRow
    const mysqlPathMap = new Map();
    for (const row of mysqlPaths) {
      mysqlPathMap.set(row.id, row);
    }

    // 4. Fetch PostgreSQL CareerPaths
    console.log("\n🐘 Step 3: Fetching PostgreSQL CareerPath records...");
    const pgCareerPaths = await prisma.careerPath.findMany({
      select: {
        id: true,
        pathName: true,
        pathId: true,
        graduation: true,
        aftergraduation: true,
        path: { select: { id: true, pathtype: true } },
      },
      orderBy: { id: "asc" },
    });

    console.log(`   Total PostgreSQL CareerPaths: ${pgCareerPaths.length}`);

    if (pgCareerPaths.length === 0) {
      console.log("⚠️ No CareerPath records found in PostgreSQL database!");
      return;
    }

    // 5. Match and Update
    console.log("\n🔄 Step 4: Correcting CareerPath pathId relations...");
    let updatedCount = 0;
    let unchangedCount = 0;
    let unmatchedCount = 0;

    for (const cp of pgCareerPaths) {
      let targetPgPathId = null;
      let matchedMysqlRow = null;

      // Method A: Check pathName format "Career Path <mysqlId>"
      const match = cp.pathName ? cp.pathName.match(/Career Path (\d+)/i) : null;
      if (match && match[1]) {
        const mysqlId = Number(match[1]);
        matchedMysqlRow = mysqlPathMap.get(mysqlId);
      }

      // Method B: Fallback match by graduation & aftergraduation
      if (!matchedMysqlRow) {
        for (const mRow of mysqlPaths) {
          if (
            normalize(mRow.graduation) === normalize(cp.graduation) &&
            normalize(mRow.after_graduation) === normalize(cp.aftergraduation)
          ) {
            matchedMysqlRow = mRow;
            break;
          }
        }
      }

      if (matchedMysqlRow) {
        targetPgPathId = mysqlIdToPgId.get(matchedMysqlRow.pathtype_id);
      }

      // Method C: If neither matched, but current pathId is an old MySQL ID (3, 4, 6, 7...)
      if (!targetPgPathId && cp.pathId && mysqlIdToPgId.has(cp.pathId)) {
        targetPgPathId = mysqlIdToPgId.get(cp.pathId);
      }

      if (targetPgPathId) {
        if (cp.pathId !== targetPgPathId) {
          await prisma.careerPath.update({
            where: { id: cp.id },
            data: { pathId: targetPgPathId },
          });
          updatedCount++;
        } else {
          unchangedCount++;
        }
      } else {
        unmatchedCount++;
      }
    }

    console.log("\n==========================================================");
    console.log("📊 FIX SUMMARY:");
    console.log("==========================================================");
    console.log(`✅ Total CareerPaths updated to correct PathType: ${updatedCount}`);
    console.log(`⏩ Already correct (unchanged): ${unchangedCount}`);
    console.log(`❓ Unmatched: ${unmatchedCount}`);

    // Verification: Show new distribution
    const newStats = await prisma.careerPath.groupBy({
      by: ["pathId"],
      _count: { id: true },
    });

    console.log("\n🐘 Updated PostgreSQL CareerPath distribution by pathId:");
    const statsTable = newStats.map((s) => {
      const pt = pgPathTypes.find((p) => p.id === s.pathId);
      return {
        pathId: s.pathId,
        PathTitle: pt ? pt.pathtype : "Unknown",
        CareerPathCount: s._count.id,
      };
    });
    console.table(statsTable);

    console.log("🎉 PATHTYPE MAPPING FIX COMPLETED SUCCESSFULLY!");
    console.log("==========================================================\n");

  } catch (error) {
    console.error("❌ Fix Error:", error);
  } finally {
    await prisma.$disconnect();
    try {
      await mysqlConnection.end();
    } catch {}
  }
}

fixPathTypeMapping();

