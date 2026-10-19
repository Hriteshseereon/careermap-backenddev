import { mysqlConnection } from "../config/mysql.js";
import prisma from "../../config/db.js";

import { loadMappings } from "../helpers/loadMappings.js";
import { buildIdMap } from "../helpers/buildIdMap.js";

async function migrateCareerPath() {
  try {
    // ==========================
    // MySQL Data
    // ==========================

    const [rows] = await mysqlConnection.query(`
      SELECT *
      FROM paths
    `);

    const [oldStreams] = await mysqlConnection.query(`
      SELECT id,name
      FROM streams
    `);

    const [oldCategories] = await mysqlConnection.query(`
      SELECT id,title
      FROM categories
    `);

    const [oldSecondCategories] = await mysqlConnection.query(`
      SELECT id,name
      FROM category2s
    `);

    const [oldSubCategories] = await mysqlConnection.query(`
      SELECT id,title
      FROM subcategories
    `);

    const [oldPathTypes] = await mysqlConnection.query(`
      SELECT id,title
      FROM path_types
    `);

    console.log("========================================");
    console.log("Total Career Paths :", rows.length);
    console.log("========================================");

    // ==========================
    // PostgreSQL Data
    // ==========================

    const mappings = await loadMappings();

    console.log("\n========== POSTGRES DATA ==========");

    console.log("Streams :", mappings.streams.length);
    console.log("Categories :", mappings.categories.length);
    console.log("Second Categories :", mappings.secondCategories.length);
    console.log("Sub Categories :", mappings.subCategories.length);
    console.log("Path Types :", mappings.pathTypes.length);

    const count = await prisma.careerPath.count();

    console.log("Current CareerPath Records :", count);

    // ==========================
    // Build Maps
    // ==========================

    const streamIdMap = buildIdMap({
      oldRows: oldStreams,
      newRows: mappings.streams,
      oldField: "name",
      newField: "name",
      label: "Stream",
    });

    const categoryIdMap = buildIdMap({
      oldRows: oldCategories,
      newRows: mappings.categories,
      oldField: "title",
      newField: "title",
      label: "Category",
    });

    const secondCategoryIdMap = buildIdMap({
      oldRows: oldSecondCategories,
      newRows: mappings.secondCategories,
      oldField: "name",
      newField: "name",
      label: "Second Category",
    });

    const subCategoryIdMap = buildIdMap({
      oldRows: oldSubCategories,
      newRows: mappings.subCategories,
      oldField: "title",
      newField: "title",
      label: "Sub Category",
    });

    const pathTypeIdMap = buildIdMap({
      oldRows: oldPathTypes,
      newRows: mappings.pathTypes,
      oldField: "title",
      newField: "pathtype",
      label: "Path Type",
    });

    // ==========================
    // Summary
    // ==========================

    console.log("\n========================================");
    console.log("Mapping Summary");
    console.log("========================================");

    console.log("Stream :", Object.keys(streamIdMap).length);
    console.log("Category :", Object.keys(categoryIdMap).length);
    console.log("Second Category :", Object.keys(secondCategoryIdMap).length);
    console.log("Sub Category :", Object.keys(subCategoryIdMap).length);
    console.log("Path Type :", Object.keys(pathTypeIdMap).length);

    console.log("\nSample Row");
    console.log(rows[0]);

    console.log("\nMapped IDs");

    console.log({
      streamId: streamIdMap[rows[0].stream_id] ?? null,
      categoryId: categoryIdMap[rows[0].category_id] ?? null,
      secondcategoryId:
        secondCategoryIdMap[rows[0].category2_id] ?? null,
      subcategoryId:
        subCategoryIdMap[rows[0].subcategory_id] ?? null,
      pathId:
        pathTypeIdMap[rows[0].pathtype_id] ?? null,
    });

    console.log("\n🚀 Starting Test Migration (10 Records)...");

    let success = 0;
    let failed = 0;

    for (const row of rows) {
      try {
        await prisma.careerPath.create({
          data: {
            pathName: `Career Path ${row.id}`,

            moduleId: null,

            categoryId:
              categoryIdMap[row.category_id] ?? null,

            secondcategoryId:
              secondCategoryIdMap[row.category2_id] ?? null,

            subcategoryId:
              subCategoryIdMap[row.subcategory_id] ?? null,

            pathId:
              pathTypeIdMap[row.pathtype_id] ?? null,

            graduation: row.graduation || null,

            aftergraduation:
              row.after_graduation || null,

            afterpostgraduation:
              row.after_pgraduation || null,

            anyother: row.anyother || null,
          },
        });

        success++;

        console.log(`✅ ${success}. Career Path ${row.id}`);
      } catch (err) {
        failed++;

        console.log(`❌ Failed : Career Path ${row.id}`);
        console.log(err.message);
      }
    }

    console.log("\n========================================");
    console.log("Migration Completed");
    console.log("========================================");

    console.log("Success :", success);
    console.log("Failed :", failed);
  } catch (error) {
    console.error(error);
  } finally {
    await mysqlConnection.end();
    await prisma.$disconnect();
  }
}

migrateCareerPath();