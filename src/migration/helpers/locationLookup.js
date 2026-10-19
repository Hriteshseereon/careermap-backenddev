import { mysqlConnection } from "../config/mysql.js";

export async function loadLocationLookup() {
  // ==========================
  // Country
  // ==========================

  const [countries] = await mysqlConnection.query(`
    SELECT id, name
    FROM countries
  `);

  // ==========================
  // State
  // ==========================

  const [states] = await mysqlConnection.query(`
    SELECT id, name
    FROM states
  `);

  // ==========================
  // District
  // ==========================

  const [districts] = await mysqlConnection.query(`
    SELECT id, name
    FROM districts
  `);

  // ==========================
  // Build Lookup Objects
  // ==========================

  const countryMap = {};
  const stateMap = {};
  const districtMap = {};

  for (const row of countries) {
    countryMap[row.id] = row.name?.trim() || null;
  }

  for (const row of states) {
    stateMap[row.id] = row.name?.trim() || null;
  }

  for (const row of districts) {
    districtMap[row.id] = row.name?.trim() || null;
  }

  console.log("\n========== LOCATION LOOKUP ==========");
  console.log("Countries :", Object.keys(countryMap).length);
  console.log("States    :", Object.keys(stateMap).length);
  console.log("Districts :", Object.keys(districtMap).length);

  return {
    countryMap,
    stateMap,
    districtMap,
  };
}