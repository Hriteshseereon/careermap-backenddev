import pg from 'pg';

const neonUrl = "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString: neonUrl });

async function main() {
  try {
    // 1. Check all CareerPaths and what hierarchy fields they have
    const cpStats = await pool.query(`
      SELECT 
        CASE 
          WHEN "subcategoryId" IS NOT NULL THEN 'has_sub'
          WHEN "secondcategoryId" IS NOT NULL THEN 'has_sec_only'
          WHEN "categoryId" IS NOT NULL THEN 'has_cat_only'
          ELSE 'no_cat'
        END as level,
        count(*)
      FROM "CareerPath"
      GROUP BY 1
    `);
    console.log("CareerPath distribution by deepest level:", cpStats.rows);

    // 2. Check Details distribution
    const detailsStats = await pool.query(`
      SELECT 
        CASE 
          WHEN "subcategoryId" IS NOT NULL THEN 'has_sub'
          WHEN "secondcategoryId" IS NOT NULL THEN 'has_sec_only'
          WHEN "categoryId" IS NOT NULL THEN 'has_cat_only'
          ELSE 'no_cat'
        END as level,
        count(*)
      FROM "Details"
      GROUP BY 1
    `);
    console.log("Details distribution by deepest level:", detailsStats.rows);

    // 3. For Details that have subcategoryId, how many have matching CareerPath with that subcategoryId?
    const subMatch = await pool.query(`
      SELECT d.id as d_id, d."categoryId", d."secondcategoryId", d."subcategoryId",
             count(cp.id) as match_sub,
             count(cp2.id) as match_sec,
             count(cp3.id) as match_cat
      FROM "Details" d
      LEFT JOIN "CareerPath" cp ON cp."subcategoryId" = d."subcategoryId"
      LEFT JOIN "CareerPath" cp2 ON cp2."secondcategoryId" = d."secondcategoryId" AND cp2."subcategoryId" IS NULL
      LEFT JOIN "CareerPath" cp3 ON cp3."categoryId" = d."categoryId" AND cp3."secondcategoryId" IS NULL AND cp3."subcategoryId" IS NULL
      WHERE d."subcategoryId" IS NOT NULL
      GROUP BY d.id, d."categoryId", d."secondcategoryId", d."subcategoryId"
    `);
    console.log("Sample Details with subcategory matching stats (first 10):", subMatch.rows.slice(0, 10));

    // 4. For Details with secondcategoryId (and subcategoryId IS NULL):
    const secMatch = await pool.query(`
      SELECT d.id as d_id, d."categoryId", d."secondcategoryId",
             count(cp.id) as match_sec,
             count(cp2.id) as match_cat
      FROM "Details" d
      LEFT JOIN "CareerPath" cp ON cp."secondcategoryId" = d."secondcategoryId"
      LEFT JOIN "CareerPath" cp2 ON cp2."categoryId" = d."categoryId" AND cp2."secondcategoryId" IS NULL
      WHERE d."secondcategoryId" IS NOT NULL AND d."subcategoryId" IS NULL
      GROUP BY d.id, d."categoryId", d."secondcategoryId"
    `);
    console.log("Details with secondcategory only (total):", secMatch.rows.length);
    console.log("Sample (first 5):", secMatch.rows.slice(0, 5));

    // 5. For Details with categoryId only (secondcategory and subcategory IS NULL):
    const catMatch = await pool.query(`
      SELECT d.id as d_id, d."categoryId",
             count(cp.id) as match_cat
      FROM "Details" d
      LEFT JOIN "CareerPath" cp ON cp."categoryId" = d."categoryId" AND cp."secondcategoryId" IS NULL AND cp."subcategoryId" IS NULL
      WHERE d."secondcategoryId" IS NULL AND d."subcategoryId" IS NULL
      GROUP BY d.id, d."categoryId"
    `);
    console.log("Details with category only (total):", catMatch.rows.length);
    console.log("Sample with matches:", catMatch.rows.filter(r => r.match_cat > 0).slice(0, 5));

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
