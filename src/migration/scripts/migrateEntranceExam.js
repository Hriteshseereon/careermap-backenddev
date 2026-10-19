import { mysqlConnection } from "../config/mysql.js";
import prisma from "../../config/db.js";
import { loadMappings } from "../helpers/loadMappings.js";
import { buildIdMap } from "../helpers/buildIdMap.js";
import { parseDate } from "../helpers/parseDate.js";
async function migrateEntranceExam() {
  try {
    // ==========================
    // MySQL Data
    // ==========================

    const [rows] = await mysqlConnection.query(`
      SELECT *
      FROM entrances
    `);

    const [oldStreams] = await mysqlConnection.query(`
      SELECT id, name
      FROM streams
    `);

    const [oldCategories] = await mysqlConnection.query(`
      SELECT id, title
      FROM categories
    `);

    const [oldSecondCategories] = await mysqlConnection.query(`
      SELECT id, name
      FROM category2s
    `);

    const [oldSubCategories] = await mysqlConnection.query(`
      SELECT id, title
      FROM subcategories
    `);

    console.log("========================================");
    console.log("Total Entrance Rows :", rows.length);
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

    const count = await prisma.entranceExam.count();
    console.log("Current EntranceExam Records :", count);

    // ==========================
    // Build ID Maps
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

    // ==========================
    // Mapping Summary
    // ==========================

    console.log("\n========================================");
    console.log("Mapping Summary");
    console.log("========================================");

    console.log("Stream Mapped :", Object.keys(streamIdMap).length);
    console.log("Category Mapped :", Object.keys(categoryIdMap).length);
    console.log(
      "Second Category Mapped :",
      Object.keys(secondCategoryIdMap).length
    );
    console.log(
      "Sub Category Mapped :",
      Object.keys(subCategoryIdMap).length
    );

    // ==========================
    // Sample Mapping
    // ==========================

    console.log("\nSample Entrance Row");
    console.log(rows[0]);

    console.log("\nMapped IDs");

    console.log({
      oldStreamId: rows[0].stream_id,
      newStreamId: streamIdMap[rows[0].stream_id] ?? null,

      oldCategoryId: rows[0].category_id,
      newCategoryId: categoryIdMap[rows[0].category_id] ?? null,

      oldSecondCategoryId: rows[0].category2_id,
      newSecondCategoryId:
        secondCategoryIdMap[rows[0].category2_id] ?? null,

      oldSubCategoryId: rows[0].subcategory_id,
      newSubCategoryId:
        subCategoryIdMap[rows[0].subcategory_id] ?? null,
    });

    console.log("\n✅ Mapping Completed.");


    // ==========================
// Test Migration (First 10 Rows)
// ==========================

console.log("\n🚀 Starting Test Migration (10 Records)...");

let success = 0;
let failed = 0;

for (const row of rows){
  try {
    // Duplicate check
    const exists = await prisma.entranceExam.findUnique({
      where: {
        examname: row.exam_name,
      },
    });

    if (exists) {
      console.log(`⚠️ Skipped Duplicate : ${row.exam_name}`);
      continue;
    }

    await prisma.entranceExam.create({
      data: {
        moduleId: null,

        streamId: streamIdMap[row.stream_id] ?? null,

        categoryId: categoryIdMap[row.category_id] ?? null,

        secondcategoryId:
          secondCategoryIdMap[row.category2_id] ?? null,

        subcategoryId:
          subCategoryIdMap[row.subcategory_id] ?? null,

        examname: row.exam_name,

        issuedate: parseDate(row.issue_date),

        lastdate: parseDate(row.last_date),

        url: row.url ?? null,
      },
    });

    success++;

    if (success % 25 === 0) {
  console.log(`Inserted ${success} records...`);
}
  } catch (err) {
    failed++;

    console.log(`❌ Failed : ${row.exam_name}`);
    console.log(err.message);
  }
}

console.log("\n========================================");
console.log("TEST MIGRATION COMPLETED");
console.log("========================================");
console.log("Inserted :", success);
console.log("Failed   :", failed);
  } catch (error) {
    console.error(error);
  } finally {
    await mysqlConnection.end();
    await prisma.$disconnect();
  }
}

migrateEntranceExam();