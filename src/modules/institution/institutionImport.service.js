import prisma from "../../config/db.js";

import {
  InstitutionImportRepository,
} from "./institutionImport.repository.js";

import {
  parseInstitutionExcel,
} from "../../utils/excel/institutionExcel.parser.js";

import {
  normalizeValue,
} from "../../utils/excel/institutionExcel.validator.js";

const BATCH_SIZE = 100;

export const uploadInstitutionExcel = async (
  file
) => {
  if (!file) {
    return {
      success: false,
      message: "Excel file is required",
    };
  }

  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  if (
    !allowedTypes.includes(file.mimetype)
  ) {
    return {
      success: false,
      message:
        "Only Excel files are allowed",
    };
  }

  const rows =
    parseInstitutionExcel(file.buffer);

  if (!rows.length) {
    return {
      success: false,
      message: "Excel file is empty",
    };
  }

  const importJob =
    await InstitutionImportRepository.create({
      fileName: file.originalname,
      totalRows: rows.length,
      status: "processing",
    });

  // Start processing
  processInstitutionRows(
    rows,
    importJob.id
  );

  return {
    success: true,
    message:
      "Institution import started",
    data: {
      importId: importJob.id,
      totalRows: rows.length,
    },
  };
};


const processInstitutionRows = async (
  rows,
  importId
) => {
  try {
    /**
     * --------------------------------
     * 1. Load master data once
     * --------------------------------
     */

    // const [
    //   categories,
    //   secondCategories,
    //   subcategories,
    // ] = await Promise.all([
    //   prisma.category.findMany(),
    //   prisma.secondcategory.findMany(),
    //   prisma.subcategory.findMany(),
    // ]);
    const categories =
  await prisma.category.findMany();

const secondCategories =
  await prisma.secondcategory.findMany();

const subcategories =
  await prisma.subcategory.findMany();
    /**
     * Helper to clean text for fuzzy matching (& vs and, extra spaces)
     */
    const cleanText = (str) => {
      if (!str) return "";
      return String(str)
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ");
    };

    /**
     * --------------------------------
     * 2. Create lookup maps
     * --------------------------------
     */

    const categoryMap = new Map();

    categories.forEach((category) => {
      categoryMap.set(normalizeValue(category.title), category.id);
      categoryMap.set(cleanText(category.title), category.id);
    });

    const secondCategoryMap = new Map();

    secondCategories.forEach((secondCategory) => {
      const key1 = [
        secondCategory.categoryId,
        normalizeValue(secondCategory.name),
      ].join("|");
      const key2 = [
        secondCategory.categoryId,
        cleanText(secondCategory.name),
      ].join("|");

      secondCategoryMap.set(key1, secondCategory.id);
      secondCategoryMap.set(key2, secondCategory.id);
    });

    const subcategoryMap = new Map();

    subcategories.forEach((subcategory) => {
      const key1 = [
        subcategory.categoryId,
        subcategory.secondcategoryId,
        normalizeValue(subcategory.title),
      ].join("|");
      const key2 = [
        subcategory.categoryId,
        subcategory.secondcategoryId,
        cleanText(subcategory.title),
      ].join("|");

      subcategoryMap.set(key1, subcategory.id);
      subcategoryMap.set(key2, subcategory.id);
    });

    /**
     * --------------------------------
     * 3. Prepare rows & Deduplicate
     * --------------------------------
     */

    const validRows = [];
    const seenNamesInExcel = new Set();
    const missingCategoriesCount = new Map();

    let failed = 0;
    let skipped = 0;

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      const rawCategory = String(row["CATEGORY"] || "").trim();
      const rawSecondary = String(row["SECONDARY CATEGORY"] || "").trim();
      const rawSubCategory = String(row["SUB CATEGORY"] || "").trim();
      const instituteName = String(row["INSTITUTE"] || "").trim();

      /**
       * Institute name required
       */
      if (!instituteName) {
        failed++;
        continue;
      }

      // Check duplicate within the Excel itself
      const normalizedName = instituteName.toLowerCase();
      if (seenNamesInExcel.has(normalizedName)) {
        skipped++;
        continue;
      }
      seenNamesInExcel.add(normalizedName);

      /**
       * Category Lookup (Exact match -> Fuzzy match) - Optional
       */
      const categoryId =
        categoryMap.get(normalizeValue(rawCategory)) ||
        categoryMap.get(cleanText(rawCategory)) ||
        null;

      if (!categoryId && rawCategory) {
        missingCategoriesCount.set(
          rawCategory,
          (missingCategoriesCount.get(rawCategory) || 0) + 1
        );
      }

      /**
       * Secondary category (Optional)
       */
      let secondcategoryId = null;
      if (categoryId && rawSecondary) {
        const key1 = [categoryId, normalizeValue(rawSecondary)].join("|");
        const key2 = [categoryId, cleanText(rawSecondary)].join("|");
        secondcategoryId =
          secondCategoryMap.get(key1) || secondCategoryMap.get(key2) || null;
      }

      /**
       * Subcategory (Optional)
       */
      let subcategoryId = null;
      if (categoryId && secondcategoryId && rawSubCategory) {
        const key1 = [
          categoryId,
          secondcategoryId,
          normalizeValue(rawSubCategory),
        ].join("|");
        const key2 = [
          categoryId,
          secondcategoryId,
          cleanText(rawSubCategory),
        ].join("|");
        subcategoryId =
          subcategoryMap.get(key1) || subcategoryMap.get(key2) || null;
      }

      validRows.push({
        categoryId,
        secondcategoryId,
        subcategoryId,
        name: instituteName,
        logo: String(row["LOGO"] || "").trim() || null,
        address: String(row["ADDRESS"] || "").trim() || null,
        url: String(row["WEBSITE LINK"] || "").trim() || null,
        countruy: String(row["COUNTRY"] || "").trim() || null,
        state: String(row["STATE"] || "").trim() || null,
        institute_type: String(row["TYPE"] || "").trim() || null,
        course_offered: [],
        is_top: false,
      });
    }

    if (missingCategoriesCount.size > 0) {
      console.log(`\n⚠️ MISSING CATEGORIES IN DATABASE:`);
      missingCategoriesCount.forEach((count, cat) => {
        console.log(`   - "${cat}": ${count} rows failed`);
      });
    }

    console.log(`\n==================================================`);
    console.log(`📊 Total Rows in Excel: ${rows.length}`);
    console.log(`✅ Valid Unique Rows to Process: ${validRows.length}`);
    console.log(`⏩ Duplicates in Excel Skipped: ${skipped}`);
    console.log(`❌ Invalid / Missing Category Rows: ${failed}`);
    console.log(`==================================================\n`);

    /**
     * --------------------------------
     * 4. Insert batches
     * --------------------------------
     */

    let successful = 0;
    const totalBatches = Math.ceil(validRows.length / BATCH_SIZE);

    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const batch = validRows.slice(i, i + BATCH_SIZE);

      const result = await prisma.institutions.createMany({
        data: batch,
        skipDuplicates: true,
      });

      const batchInserted = result.count;
      const batchSkipped = batch.length - batchInserted;

      successful += batchInserted;
      skipped += batchSkipped;

      const progressPercent = (
        (Math.min(i + BATCH_SIZE, validRows.length) / validRows.length) *
        100
      ).toFixed(1);

      console.log(
        `[BATCH ${batchNumber}/${totalBatches}] Progress: ${progressPercent}% | Inserted: ${batchInserted} | Skipped (DB Duplicates): ${batchSkipped}`
      );

      await InstitutionImportRepository.update(importId, {
        processed: Math.min(i + BATCH_SIZE, validRows.length),
        successful,
        failed,
        skipped,
      });
    }

    /**
     * --------------------------------
     * 5. Complete
     * --------------------------------
     */

    console.log(`\n==================================================`);
    console.log(`🎉 IMPORT COMPLETED!`);
    console.log(`Total Rows: ${rows.length}`);
    console.log(`Successfully Inserted: ${successful}`);
    console.log(`Total Skipped (Duplicates): ${skipped}`);
    console.log(`Total Failed: ${failed}`);
    console.log(`==================================================\n`);

    await InstitutionImportRepository.update(importId, {
      processed: rows.length,
      successful,
      failed,
      skipped,
      status: "completed",
    });
  } catch (error) {
    console.error("❌ Institution import error:", error);

    await InstitutionImportRepository.update(importId, {
      status: "failed",
    });
  }
};