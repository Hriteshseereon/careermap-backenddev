import "dotenv/config";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import prisma from "../config/db.js";

const BATCH_SIZE = 500;

// Helper to normalize strings for matching
const normalizeValue = (value) => {
  if (!value) return "";
  return String(value).trim().toLowerCase();
};

const normalizeInstituteType = (type) => {
  if (!type) return null;
  const t = String(type).trim().toLowerCase();
  if (t === "government" || t === "govt" || t === "govt." || t === "gov") {
    return "Govt";
  }
  if (t === "private" || t === "pvt" || t === "pvt.") {
    return "Pvt";
  }
  if (t === "autonomous") {
    return "Autonomous";
  }
  if (t.includes("deemed")) {
    return "Deemed";
  }
  return String(type).trim();
};

const cleanText = (str) => {
  if (!str) return "";
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
};

async function reseedInstitutions() {
  const startTime = Date.now();
  console.log("==========================================================");
  console.log("🚀 STARTING INSTITUTIONS RESEED PROCESS");
  console.log("==========================================================\n");

  try {
    // 1. Locate Excel file
    const cwd = process.cwd();
    let filePath = path.join(cwd, "Institution.xlsx");
    if (!fs.existsSync(filePath)) {
      filePath = path.join(cwd, "institution.xlsx");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`Institution.xlsx not found at: ${filePath}`);
    }

    console.log(`📖 Reading Excel file: ${filePath}`);
    const workbook = XLSX.readFile(filePath, { cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    console.log(`📊 Total rows found in sheet "${sheetName}": ${rows.length}`);

    if (rows.length === 0) {
      throw new Error("Excel file is empty!");
    }

    // 2. Check current database state
    const beforeCount = await prisma.institutions.count();
    console.log(`\n🏢 Existing Institutions in Database before deletion: ${beforeCount}`);

    // 3. Clear existing institutions table cleanly and ensure unique name constraint is removed
    console.log("🗑️ Deleting all existing institutions from database...");
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Institutions" RESTART IDENTITY CASCADE;');
    console.log("🔓 Ensuring name uniqueness constraint is removed (to allow multi-category institutions)...");
    await prisma.$executeRawUnsafe('ALTER TABLE "Institutions" DROP CONSTRAINT IF EXISTS "Institutions_name_key";');
    await prisma.$executeRawUnsafe('DROP INDEX IF EXISTS "Institutions_name_key";');
    const afterDeleteCount = await prisma.institutions.count();
    console.log(`✅ Table truncated! Institutions remaining: ${afterDeleteCount}\n`);

    // 4. Load master categories for linking
    console.log("🔍 Loading Categories, Second Categories & Subcategories...");
    const [categories, secondCategories, subcategories] = await Promise.all([
      prisma.category.findMany({ select: { id: true, title: true } }),
      prisma.secondcategory.findMany({ select: { id: true, name: true, categoryId: true } }),
      prisma.subcategory.findMany({ select: { id: true, title: true, categoryId: true, secondcategoryId: true } }),
    ]);

    console.log(`   - Found ${categories.length} Categories in DB`);
    console.log(`   - Found ${secondCategories.length} Second Categories in DB`);
    console.log(`   - Found ${subcategories.length} Subcategories in DB`);

    // Lookup maps
    const categoryMap = new Map();
    categories.forEach((cat) => {
      categoryMap.set(normalizeValue(cat.title), cat.id);
      categoryMap.set(cleanText(cat.title), cat.id);
    });

    const secondCategoryMap = new Map();
    secondCategories.forEach((sc) => {
      secondCategoryMap.set(`${sc.categoryId}|${normalizeValue(sc.name)}`, sc.id);
      secondCategoryMap.set(`${sc.categoryId}|${cleanText(sc.name)}`, sc.id);
    });

    const subCategoryMap = new Map();
    subcategories.forEach((sub) => {
      subCategoryMap.set(`${sub.categoryId}|${sub.secondcategoryId}|${normalizeValue(sub.title)}`, sub.id);
      subCategoryMap.set(`${sub.categoryId}|${sub.secondcategoryId}|${cleanText(sub.title)}`, sub.id);
    });

    // 5. Process & Deduplicate rows
    // Multi-category support: An institution (e.g. university) can have rows for Engineering, Medical, Arts, etc.
    // We allow multiple categories per institution, only filtering out 100% exact duplicate rows (same institute + same category + same state).
    console.log("\n⚙️ Processing and validating rows (with multi-category support)...");
    const validRows = [];
    const seenCombos = new Set();
    let emptyNames = 0;
    let exactDuplicateCount = 0;

    for (const row of rows) {
      const instituteName = String(row["INSTITUTE"] || "").trim();
      if (!instituteName) {
        emptyNames++;
        continue;
      }

      const normalizedName = instituteName.toLowerCase();
      const rawCategory = String(row["CATEGORY"] || "").trim();
      const rawSecondary = String(row["SECONDARY CATEGORY"] || "").trim();
      const rawSubCategory = String(row["SUB CATEGORY"] || "").trim();
      const state = String(row["STATE"] || "").trim();

      // Category lookup
      const categoryId =
        categoryMap.get(normalizeValue(rawCategory)) ||
        categoryMap.get(cleanText(rawCategory)) ||
        null;

      // Second category lookup
      let secondcategoryId = null;
      if (categoryId && rawSecondary) {
        secondcategoryId =
          secondCategoryMap.get(`${categoryId}|${normalizeValue(rawSecondary)}`) ||
          secondCategoryMap.get(`${categoryId}|${cleanText(rawSecondary)}`) ||
          null;
      }

      // Subcategory lookup
      let subcategoryId = null;
      if (categoryId && secondcategoryId && rawSubCategory) {
        subcategoryId =
          subCategoryMap.get(`${categoryId}|${secondcategoryId}|${normalizeValue(rawSubCategory)}`) ||
          subCategoryMap.get(`${categoryId}|${secondcategoryId}|${cleanText(rawSubCategory)}`) ||
          null;
      }

      // Exact duplicate check (same institute + same category + same subcategory + same state)
      const comboKey = `${normalizedName}|${categoryId || normalizeValue(rawCategory)}|${secondcategoryId || normalizeValue(rawSecondary)}|${subcategoryId || normalizeValue(rawSubCategory)}|${normalizeValue(state)}`;

      if (seenCombos.has(comboKey)) {
        exactDuplicateCount++;
        continue;
      }
      seenCombos.add(comboKey);

      // Parse course_offered array
      let course_offered = [];
      const rawCourses = row["COURSE OFFERED"];
      if (rawCourses) {
        if (Array.isArray(rawCourses)) {
          course_offered = rawCourses.map((c) => String(c).trim()).filter(Boolean);
        } else {
          course_offered = String(rawCourses)
            .split(/[,;\n]/)
            .map((c) => c.trim())
            .filter(Boolean);
        }
      }

      validRows.push({
        name: instituteName,
        categoryId,
        secondcategoryId,
        subcategoryId,
        institute_type: normalizeInstituteType(row["TYPE"]),
        state: String(row["STATE"] || "").trim() || null,
        city: String(row["CITY"] || "").trim() || null,
        district: String(row["DISTRICT"] || "").trim() || null,
        countruy: String(row["COUNTRY"] || "").trim() || "India",
        address: String(row["ADDRESS"] || "").trim() || null,
        url: String(row["WEBSITE LINK"] || "").trim() || null,
        logo: String(row["LOGO"] || "").trim() || null,
        about: String(row["ABOUT"] || "").trim() || null,
        admission_process: String(row["ADMISSION PROCESS"] || "").trim() || null,
        tentative_date: String(row["TENTATIVE DATE"] || "").trim() || null,
        course_offered,
        is_top: false,
      });
    }

    console.log(`✅ Valid unique institutions to insert: ${validRows.length}`);
    if (exactDuplicateCount > 0) {
      console.log(`⏩ Exact identical duplicates skipped: ${exactDuplicateCount}`);
    }
    if (emptyNames > 0) {
      console.log(`⚠️ Rows skipped (Empty name): ${emptyNames}`);
    }

    // 6. Batch Insert
    console.log(`\n📦 Inserting in batches of ${BATCH_SIZE}...`);
    let totalInserted = 0;
    const totalBatches = Math.ceil(validRows.length / BATCH_SIZE);

    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const batch = validRows.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;

      const result = await prisma.institutions.createMany({
        data: batch,
        skipDuplicates: true,
      });

      totalInserted += result.count;
      const percent = ((Math.min(i + BATCH_SIZE, validRows.length) / validRows.length) * 100).toFixed(1);
      console.log(`   [Batch ${batchNum}/${totalBatches}] Progress: ${percent}% | +${result.count} inserted (Total: ${totalInserted})`);
    }

    // 7. Verification
    const finalCount = await prisma.institutions.count();
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log("\n==========================================================");
    console.log("🎉 RESEED COMPLETED SUCCESSFULLY!");
    console.log("==========================================================");
    console.log(`🏢 Total Institutions in Database now: ${finalCount}`);
    console.log(`⏱️ Time taken: ${duration} seconds`);
    console.log("==========================================================\n");

  } catch (error) {
    console.error("\n❌ RESEED FAILED WITH ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

reseedInstitutions();

