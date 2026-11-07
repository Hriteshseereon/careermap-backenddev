import "dotenv/config";
import fs from "fs";
import path from "path";
import prisma from "../config/db.js";
import { parseInstitutionExcel } from "../utils/excel/institutionExcel.parser.js";
import { createCategoryResolver } from "../utils/excel/categoryResolver.js";
import { canonicalState } from "../utils/stateNormalizer.js";

/**
 * The Excel STATE column uses merged cells, so older imports saved most rows
 * (e.g. 790 MBBS colleges) without a state. This fills state / city / district
 * on those rows from the Excel (merged cells expanded) and never overwrites a
 * value that is already set.
 *
 *   node src/scripts/fillMissingInstitutionStates.js          -> dry run
 *   node src/scripts/fillMissingInstitutionStates.js --apply  -> write changes
 */

const APPLY = process.argv.includes("--apply");
const norm = (v) => String(v || "").trim().toLowerCase();
const text = (v) => String(v || "").trim();

async function main() {
  const filePath = ["Institution.xlsx", "institution.xlsx"]
    .map((f) => path.join(process.cwd(), f))
    .find((f) => fs.existsSync(f));
  if (!filePath) throw new Error("Institution.xlsx not found in project root");

  const rows = parseInstitutionExcel(fs.readFileSync(filePath));

  const [categories, secondCategories, subcategories] = await Promise.all([
    prisma.category.findMany({ select: { id: true, title: true } }),
    prisma.secondcategory.findMany({ select: { id: true, name: true, categoryId: true } }),
    prisma.subcategory.findMany({
      select: { id: true, title: true, categoryId: true, secondcategoryId: true },
    }),
  ]);
  const resolve = createCategoryResolver({ categories, secondCategories, subcategories });

  // name + category path -> Excel rows that carry a state
  const excelByKey = new Map();
  for (const row of rows) {
    const name = text(row["INSTITUTE"]);
    const state = text(row["STATE"]);
    if (!name || !state) continue;

    const { categoryId, secondcategoryId, subcategoryId } = resolve(
      text(row["CATEGORY"]),
      text(row["SECONDARY CATEGORY"]),
      text(row["SUB CATEGORY"])
    );
    const key = [norm(name), categoryId, secondcategoryId, subcategoryId].join("|");
    if (!excelByKey.has(key)) excelByKey.set(key, []);
    excelByKey.get(key).push({
      state: canonicalState(state) || state,
      city: text(row["CITY"]) || null,
      district: text(row["DISTRICT"]) || null,
    });
  }

  const missing = await prisma.institutions.findMany({
    where: { OR: [{ state: null }, { state: "" }] },
    select: {
      id: true, name: true, city: true, district: true,
      categoryId: true, secondcategoryId: true, subcategoryId: true,
    },
  });

  const stats = { missing: missing.length, filled: 0, ambiguous: 0, noExcelMatch: 0 };
  const byState = new Map();
  const updates = [];

  for (const inst of missing) {
    const key = [norm(inst.name), inst.categoryId, inst.secondcategoryId, inst.subcategoryId].join("|");
    const matches = excelByKey.get(key);
    if (!matches) { stats.noExcelMatch++; continue; }

    const states = new Set(matches.map((m) => m.state));
    if (states.size !== 1) { stats.ambiguous++; continue; }

    const m = matches[0];
    updates.push({
      id: inst.id,
      data: {
        state: m.state,
        ...(inst.city ? {} : m.city ? { city: m.city } : {}),
        ...(inst.district ? {} : m.district ? { district: m.district } : {}),
      },
    });
    byState.set(m.state, (byState.get(m.state) || 0) + 1);
    stats.filled++;
  }

  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN (pass --apply to write)"}`);
  console.log(stats);
  console.log([...byState.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15));

  if (APPLY) {
    // One bulk update per distinct value set (usually just the state), so the
    // remote DB never needs a long transaction.
    const groups = new Map();
    for (const u of updates) {
      const key = JSON.stringify(u.data);
      if (!groups.has(key)) groups.set(key, { data: u.data, ids: [] });
      groups.get(key).ids.push(u.id);
    }

    for (const { data, ids } of groups.values()) {
      for (let i = 0; i < ids.length; i += 1000) {
        await prisma.institutions.updateMany({
          where: {
            id: { in: ids.slice(i, i + 1000) },
            OR: [{ state: null }, { state: "" }],
          },
          data,
        });
      }
    }
    console.log("✅ States filled");
  }
}

main()
  .catch((err) => { console.error("❌ Failed:", err); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
