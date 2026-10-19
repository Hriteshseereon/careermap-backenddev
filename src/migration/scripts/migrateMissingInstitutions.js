import { mysqlConnection } from "../config/mysql.js";
import prisma from "../../config/db.js";
import { loadLocationLookup } from "../helpers/locationLookup.js";
import { instituteTypeMap } from "../helpers/instituteTypeMap.js";
import fs from "fs/promises";

async function migrateMissingInstitutions() {
  try {
    console.log("========================================");
    console.log("Missing Institutions Migration");
    console.log("========================================");

    // ==========================================
    // 1. Read comparison report
    // ==========================================

    const reportRaw = await fs.readFile(
      "./institution-comparison-report.json",
      "utf8"
    );

    const report = JSON.parse(reportRaw);

    const missingInstitutions = report.missingInstitutions || [];

    console.log(
      "Missing Institutions :",
      missingInstitutions.length
    );

    if (!missingInstitutions.length) {
      console.log("\n🎉 No missing institutions found.");
      return;
    }

    // ==========================================
    // 2. Load location mappings
    // ==========================================

    const {
      countryMap,
      stateMap,
      districtMap,
    } = await loadLocationLookup();

    // ==========================================
    // 3. Get old MySQL IDs from report
    // ==========================================

    const missingIds = missingInstitutions.map(
      (institution) => institution.oldId
    );

    console.log("\nMissing MySQL IDs:", missingIds.length);

    // ==========================================
    // 4. Fetch complete records from MySQL
    // ==========================================

    const placeholders = missingIds.map(() => "?").join(",");

    const [rows] = await mysqlConnection.query(
      `
        SELECT *
        FROM institutions
        WHERE id IN (${placeholders})
        ORDER BY id
      `,
      missingIds
    );

    console.log(
      "Records fetched from MySQL :",
      rows.length
    );

    // ==========================================
    // 5. Insert ONLY missing records
    // ==========================================

    let insertedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const row of rows) {
      if (!row.name || !row.name.trim()) {
        console.log(`⚠️ Skipped empty name: MySQL ID ${row.id}`);
        skippedCount++;
        continue;
      }

      const instituteName = row.name.trim();

      try {
        // ==========================================
        // Extra safety check
        // ==========================================

        const existing = await prisma.institutions.findUnique({
          where: {
            name: instituteName,
          },
          select: {
            id: true,
            name: true,
          },
        });

        if (existing) {
          console.log(
            `⏭️ Already exists: ${instituteName} (PostgreSQL ID: ${existing.id})`
          );

          skippedCount++;
          continue;
        }

        // ==========================================
        // Create new institution
        // ==========================================

        const created = await prisma.institutions.create({
          data: {
            name: instituteName,

            // Old MySQL logo preserve kar rahe hain
            logo: row.logo || null,

            address: row.address || null,

            admission_process:
              row.admission_process || null,

            tentative_date:
              row.tentative_date || null,

            institute_type:
              instituteTypeMap[row.institute_type] ?? null,

            url: row.url || null,

            countruy:
              countryMap[row.country_id] ?? null,

            state:
              stateMap[row.state_id] ?? null,

            district:
              districtMap[row.dist_id] ?? null,

            // New DB fields
            categoryId: null,
            secondcategoryId: null,
            subcategoryId: null,

            about: null,

            course_offered: [],

            is_top: Boolean(row.is_top),

            createdAt: row.created_at
              ? new Date(row.created_at)
              : new Date(),

            updatedAt: row.updated_at
              ? new Date(row.updated_at)
              : new Date(),
          },
        });

        insertedCount++;

        console.log(
          `✅ Inserted: MySQL ID ${row.id} → PostgreSQL ID ${created.id} → ${instituteName}`
        );
      } catch (err) {
        failedCount++;

        console.log(
          `❌ Failed: MySQL ID ${row.id} → ${instituteName}`
        );

        console.log("Error:", err.message);
      }
    }

    // ==========================================
    // 6. Final Summary
    // ==========================================

    console.log("\n========================================");
    console.log("Migration Completed");
    console.log("========================================");

    console.log(
      "Missing in comparison :",
      missingInstitutions.length
    );

    console.log(
      "Fetched from MySQL    :",
      rows.length
    );

    console.log(
      "Newly Inserted        :",
      insertedCount
    );

    console.log(
      "Skipped               :",
      skippedCount
    );

    console.log(
      "Failed                :",
      failedCount
    );

    console.log("========================================");
  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error);
  } finally {
    await mysqlConnection.end();
    await prisma.$disconnect();
  }
}

migrateMissingInstitutions();