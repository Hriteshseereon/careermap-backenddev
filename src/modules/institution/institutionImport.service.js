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

import {
  createCategoryResolver,
} from "../../utils/excel/categoryResolver.js";

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

    const resolveCategories = createCategoryResolver({
      categories,
      secondCategories,
      subcategories,
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

      const normalizedName = instituteName.toLowerCase();

      /**
       * Category / Secondary / Sub category lookup (exact -> typo tolerant)
       */
      const { categoryId, secondcategoryId, subcategoryId } =
        resolveCategories(rawCategory, rawSecondary, rawSubCategory);

      if (!categoryId && rawCategory) {
        missingCategoriesCount.set(
          rawCategory,
          (missingCategoriesCount.get(rawCategory) || 0) + 1
        );
      }

      if (categoryId && rawSecondary && !secondcategoryId) {
        missingCategoriesCount.set(
          `${rawCategory} > ${rawSecondary}`,
          (missingCategoriesCount.get(`${rawCategory} > ${rawSecondary}`) || 0) + 1
        );
      }

      // Deduplicate only identical rows (same institute + same category + same subcategory + same state)
      const comboKey = `${normalizedName}|${categoryId || normalizeValue(rawCategory)}|${secondcategoryId || normalizeValue(rawSecondary)}|${subcategoryId || normalizeValue(rawSubCategory)}|${normalizeValue(row["STATE"])}`;
      if (seenNamesInExcel.has(comboKey)) {
        skipped++;
        continue;
      }
      seenNamesInExcel.add(comboKey);

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
        categoryId,
        secondcategoryId,
        subcategoryId,
        name: instituteName,
        logo: String(row["LOGO"] || "").trim() || null,
        address: String(row["ADDRESS"] || "").trim() || null,
        url: String(row["WEBSITE LINK"] || "").trim() || null,
        countruy: String(row["COUNTRY"] || "").trim() || "India",
        state: String(row["STATE"] || "").trim() || null,
        city: String(row["CITY"] || "").trim() || null,
        district: String(row["DISTRICT"] || "").trim() || null,
        institute_type: normalizeInstituteType(row["TYPE"]),
        about: String(row["ABOUT"] || "").trim() || null,
        admission_process: String(row["ADMISSION PROCESS"] || "").trim() || null,
        tentative_date: String(row["TENTATIVE DATE"] || "").trim() || null,
        course_offered,
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