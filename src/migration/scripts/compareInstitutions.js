import { mysqlConnection } from "../config/mysql.js";
import prisma from "../../config/db.js";
import fs from "fs/promises";

const normalizeName = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,'"()\-&/]/g, "");
};

async function compareInstitutions() {
  try {
    console.log("========================================");
    console.log("Institution Comparison Started");
    console.log("========================================");

    // ==========================
    // 1. Get Old MySQL Data
    // ==========================

    const [oldInstitutions] = await mysqlConnection.query(`
      SELECT id, name
      FROM institutions
      WHERE name IS NOT NULL
        AND TRIM(name) != ''
      ORDER BY id
    `);

    console.log("Old MySQL Institutions :", oldInstitutions.length);

    // ==========================
    // 2. Get New PostgreSQL Data
    // ==========================

    const newInstitutions = await prisma.institutions.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    console.log("New PostgreSQL Institutions :", newInstitutions.length);

    // ==========================
    // 3. Create Lookup Maps
    // ==========================

    const exactNameMap = new Map();
    const normalizedNameMap = new Map();

    for (const institution of newInstitutions) {
      exactNameMap.set(institution.name, institution);

      const normalized = normalizeName(institution.name);

      if (!normalizedNameMap.has(normalized)) {
        normalizedNameMap.set(normalized, []);
      }

      normalizedNameMap.get(normalized).push(institution);
    }

    // ==========================
    // 4. Compare
    // ==========================

    const exactMatches = [];
    const possibleMatches = [];
    const missingInstitutions = [];

    for (const oldInstitution of oldInstitutions) {
      const oldName = oldInstitution.name.trim();

      // --------------------------
      // Exact match
      // --------------------------

      const exactMatch = exactNameMap.get(oldName);

      if (exactMatch) {
        exactMatches.push({
          oldId: oldInstitution.id,
          oldName,
          newId: exactMatch.id,
          newName: exactMatch.name,
        });

        continue;
      }

      // --------------------------
      // Normalized match
      // --------------------------

      const normalized = normalizeName(oldName);
      const possibleMatch = normalizedNameMap.get(normalized);

      if (possibleMatch && possibleMatch.length > 0) {
        possibleMatches.push({
          oldId: oldInstitution.id,
          oldName,
          possibleMatches: possibleMatch.map((item) => ({
            newId: item.id,
            newName: item.name,
          })),
        });

        continue;
      }

      // --------------------------
      // Missing
      // --------------------------

      missingInstitutions.push({
        oldId: oldInstitution.id,
        name: oldName,
      });
    }

    // ==========================
    // 5. Print Summary
    // ==========================

    console.log("\n========================================");
    console.log("COMPARISON RESULT");
    console.log("========================================");

    console.log("Old MySQL          :", oldInstitutions.length);
    console.log("New PostgreSQL     :", newInstitutions.length);
    console.log("Exact Matches      :", exactMatches.length);
    console.log("Possible Matches   :", possibleMatches.length);
    console.log("Missing            :", missingInstitutions.length);

    // ==========================
    // 6. Print Missing
    // ==========================

    if (missingInstitutions.length > 0) {
      console.log("\n========================================");
      console.log("MISSING INSTITUTIONS");
      console.log("========================================");

      for (const institution of missingInstitutions) {
        console.log(
          `${institution.oldId} → ${institution.name}`
        );
      }
    } else {
      console.log("\n🎉 No missing institutions found.");
    }

    // ==========================
    // 7. Save Report
    // ==========================

    const report = {
      summary: {
        oldMySQL: oldInstitutions.length,
        newPostgreSQL: newInstitutions.length,
        exactMatches: exactMatches.length,
        possibleMatches: possibleMatches.length,
        missing: missingInstitutions.length,
      },

      exactMatches,

      possibleMatches,

      missingInstitutions,
    };

    await fs.writeFile(
      "./institution-comparison-report.json",
      JSON.stringify(report, null, 2)
    );

    console.log(
      "\n📄 Report saved: institution-comparison-report.json"
    );

    console.log("\n========================================");
    console.log("Comparison Completed");
    console.log("========================================");
  } catch (error) {
    console.error("\n❌ Comparison Failed:");
    console.error(error);
  } finally {
    await mysqlConnection.end();
    await prisma.$disconnect();
  }
}

compareInstitutions();