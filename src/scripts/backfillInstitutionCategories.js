import "dotenv/config";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import prisma from "../config/db.js";
import { createCategoryResolver } from "../utils/excel/categoryResolver.js";

/**
 * Non-destructive fix for institutions imported without secondcategoryId /
 * subcategoryId (Excel typos like "Medcial", "Degress", "Physiotheraphy").
 *
 * Nothing is deleted. Existing rows are matched back to their Excel row by
 * name + state + city + district (paired by insert order inside that group)
 * and only the category columns are updated.
 *
 *   node src/scripts/backfillInstitutionCategories.js          -> dry run
 *   node src/scripts/backfillInstitutionCategories.js --apply  -> write changes
 */

const APPLY = process.argv.includes("--apply");

const norm = (v) => String(v || "").trim().toLowerCase();
const rowKey = (name, state, city, district) =>
  [name, state, city, district].map(norm).join("|");

async function main() {
  const filePath = ["Institution.xlsx", "institution.xlsx"]
    .map((f) => path.join(process.cwd(), f))
    .find((f) => fs.existsSync(f));
  if (!filePath) throw new Error("Institution.xlsx not found in project root");

  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
    defval: "",
  });

  const [categories, secondCategories, subcategories] = await Promise.all([
    prisma.category.findMany({ select: { id: true, title: true } }),
    prisma.secondcategory.findMany({
      select: { id: true, name: true, categoryId: true },
    }),
    prisma.subcategory.findMany({
      select: { id: true, title: true, categoryId: true, secondcategoryId: true },
    }),
  ]);
  const resolve = createCategoryResolver({ categories, secondCategories, subcategories });

  // Excel rows in file order, de-duplicated the same way the importer does.
  const excelByKey = new Map();
  const seen = new Set();
  for (const row of rows) {
    const name = String(row["INSTITUTE"] || "").trim();
    if (!name) continue;

    const rawCat = String(row["CATEGORY"] || "").trim();
    const rawSec = String(row["SECONDARY CATEGORY"] || "").trim();
    const rawSub = String(row["SUB CATEGORY"] || "").trim();

    const dedupeKey = [name, rawCat, rawSec, rawSub, row["STATE"]].map(norm).join("|");
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const key = rowKey(name, row["STATE"], row["CITY"], row["DISTRICT"]);
    if (!excelByKey.has(key)) excelByKey.set(key, []);
    excelByKey.get(key).push(resolve(rawCat, rawSec, rawSub));
  }

  const dbRows = await prisma.institutions.findMany({
    select: {
      id: true,
      name: true,
      state: true,
      city: true,
      district: true,
      categoryId: true,
      secondcategoryId: true,
      subcategoryId: true,
    },
    orderBy: { id: "asc" },
  });

  const dbByKey = new Map();
  for (const r of dbRows) {
    const key = rowKey(r.name, r.state, r.city, r.district);
    if (!dbByKey.has(key)) dbByKey.set(key, []);
    dbByKey.get(key).push(r);
  }

  // target triple -> institution ids
  const updates = new Map();
  const stats = { unchanged: 0, updated: 0, skippedMismatch: 0, skippedNoExcel: 0 };

  for (const [key, group] of dbByKey) {
    const excel = excelByKey.get(key);
    if (!excel) {
      stats.skippedNoExcel += group.length;
      continue;
    }

    for (let i = 0; i < group.length; i++) {
      const db = group[i];
      // Pair by order when counts line up, otherwise only trust a single
      // unambiguous Excel candidate.
      let target = null;
      if (excel.length === group.length) {
        target = excel[i];
      } else {
        const distinct = new Set(excel.map((t) => JSON.stringify(t)));
        if (distinct.size === 1) target = excel[0];
      }

      if (!target || (db.categoryId && target.categoryId !== db.categoryId)) {
        stats.skippedMismatch++;
        continue;
      }

      if (
        db.categoryId === target.categoryId &&
        db.secondcategoryId === target.secondcategoryId &&
        db.subcategoryId === target.subcategoryId
      ) {
        stats.unchanged++;
        continue;
      }

      const tKey = JSON.stringify(target);
      if (!updates.has(tKey)) updates.set(tKey, { target, ids: [] });
      updates.get(tKey).ids.push(db.id);
      stats.updated++;
    }
  }

  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN (pass --apply to write)"}`);
  console.log(`DB institutions: ${dbRows.length} | Excel unique rows: ${seen.size}`);
  console.log(stats);

  for (const { target, ids } of updates.values()) {
    console.log(
      `  category=${target.categoryId} second=${target.secondcategoryId} sub=${target.subcategoryId} -> ${ids.length} rows`
    );
    if (APPLY) {
      for (let i = 0; i < ids.length; i += 1000) {
        await prisma.institutions.updateMany({
          where: { id: { in: ids.slice(i, i + 1000) } },
          data: target,
        });
      }
    }
  }

  if (APPLY) console.log("✅ Backfill complete");
}

main()
  .catch((err) => {
    console.error("❌ Backfill failed:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
