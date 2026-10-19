import { normalizeName } from "./normalizeName.js";

export function buildIdMap({
  oldRows,
  newRows,
  oldField,
  newField,
  label,
}) {
  const newLookup = new Map();

  // PostgreSQL lookup
  for (const row of newRows) {
    const key = normalizeName(row[newField]);

    if (key) {
      newLookup.set(key, row.id);
    }
  }

  const idMap = {};
  const notFound = [];

  // MySQL -> PostgreSQL mapping
  for (const row of oldRows) {
    const key = normalizeName(row[oldField]);

    const newId = newLookup.get(key);

    if (newId !== undefined){
      idMap[row.id] = newId;
    } else {
      notFound.push(row[oldField]);
    }
  }

  console.log(`\n========== ${label.toUpperCase()} MAP ==========`);

  console.log(idMap);

  if (notFound.length) {
    console.log(`\n❌ ${label} Not Found (${notFound.length})`);

    notFound.forEach((item) => console.log("-", item));
  } else {
    console.log(`✅ All ${label} mapped successfully`);
  }

  return idMap;
}