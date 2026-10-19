import { mysqlConnection } from "../config/mysql.js";
import prisma from "../../config/db.js";
import { loadLocationLookup } from "../helpers/locationLookup.js";
import { instituteTypeMap } from "../helpers/instituteTypeMap.js";

async function migrateInstitutions() {
  try {
    // ==========================
    // Read MySQL Data
    // ==========================

    const [rows] = await mysqlConnection.query(`
      SELECT *
      FROM institutions
      ORDER BY id
    `);

    console.log("========================================");
    console.log("Total Institutions :", rows.length);
    console.log("========================================");

    // ==========================
    // Load Location Lookup
    // ==========================

    const {
      countryMap,
      stateMap,
      districtMap,
    } = await loadLocationLookup();

    // ==========================
    // Current PostgreSQL Records
    // ==========================

    const count = await prisma.institutions.count();

    console.log("\nCurrent PostgreSQL Records :", count);

    // ==========================
    // Safe Migration (Upsert)
    // ==========================
    // NOTE: deleteMany() ko remove kar diya hai taaki existing data aur relations delete na hon

    console.log("\n🚀 Starting Migration (Safe Upsert Mode)...");

    let createdCount = 0;
    let updatedCount = 0;
    let failed = 0;

    for (const row of rows) {
      if (!row.name || !row.name.trim()) {
        continue;
      }

      const instituteName = row.name.trim();

      try {
        const result = await prisma.institutions.upsert({
          where: {
            name: instituteName,
          },
          update: {
            address: row.address || null,
            admission_process: row.admission_process || null,
            tentative_date: row.tentative_date || null,
            institute_type:
              instituteTypeMap[row.institute_type] ?? null,
            url: row.url || null,
            countruy: countryMap[row.country_id] ?? null,
            state: stateMap[row.state_id] ?? null,
            district: districtMap[row.dist_id] ?? null,
            is_top: Boolean(row.is_top),
            updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
          },
          create: {
            name: instituteName,
            logo: null,
            address: row.address || null,
            admission_process: row.admission_process || null,
            tentative_date: row.tentative_date || null,
            institute_type:
              instituteTypeMap[row.institute_type] ?? null,
            url: row.url || null,
            countruy: countryMap[row.country_id] ?? null,
            state: stateMap[row.state_id] ?? null,
            district: districtMap[row.dist_id] ?? null,
            categoryId: null,
            secondcategoryId: null,
            subcategoryId: null,
            about: null,
            course_offered: [],
            is_top: Boolean(row.is_top),
            createdAt: row.created_at ? new Date(row.created_at) : new Date(),
            updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
          },
        });

        // Check if created or updated
        if (result.createdAt.getTime() === result.updatedAt.getTime()) {
          createdCount++;
        } else {
          updatedCount++;
        }

        const totalProcessed = createdCount + updatedCount;
        if (totalProcessed % 50 === 0) {
          console.log(`✅ Processed ${totalProcessed} Institutions...`);
        }
      } catch (err) {
        failed++;
        console.log(`❌ Failed : ${row.name}`);
        console.log(err.message);
      }
    }

    console.log("\n========================================");
    console.log("Migration Completed Successfully");
    console.log("========================================");
    console.log("New Inserted :", createdCount);
    console.log("Updated/Kept :", updatedCount);
    console.log("Failed       :", failed);
  } catch (error) {
    console.error(error);
  } finally {
    await mysqlConnection.end();
    await prisma.$disconnect();
  }
}

migrateInstitutions();