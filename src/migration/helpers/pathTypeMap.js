import { normalizeName } from "./normalizeName.js";

export function buildPathTypeMap(oldRows, newRows) {
  const lookup = new Map();

  // PostgreSQL
  for (const row of newRows) {
    const key = normalizeName(row.pathtype);

    if (key) {
      lookup.set(key, row.id);
    }
  }

  const idMap = {};
  const notFound = [];

  // MySQL
  for (const row of oldRows) {
    const key = normalizeName(row.title);

    const newId = lookup.get(key);

    if (newId) {
      idMap[row.id] = newId;
    } else {
      notFound.push(row.title);
    }
  }

  console.log("\n========== PATH TYPE MAP ==========");
  console.log(idMap);

  if (notFound.length) {
    console.log(`\n❌ Path Types Not Found (${notFound.length})`);
    notFound.forEach((item) => console.log("-", item));
  } else {
    console.log("✅ All Path Types mapped successfully");
  }

  return idMap;
}