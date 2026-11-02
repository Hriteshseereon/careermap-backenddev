import pg from 'pg';

const neonUrl = "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString: neonUrl });

async function main() {
  try {
    const cats = await pool.query(`SELECT id, title FROM "Category" WHERE title ILIKE '%Data%' OR title ILIKE '%Computer%' OR title ILIKE '%IT%'`);
    console.log("Categories matching Data/Computer/IT:", cats.rows);

    const secs = await pool.query(`SELECT id, "categoryId", name FROM "Secondcategory" WHERE name ILIKE '%Data%' OR name ILIKE '%Computer%'`);
    console.log("Secondcategories matching Data/Computer:", secs.rows);

    const cps = await pool.query(`SELECT id, "pathName", "categoryId", "secondcategoryId", graduation, aftergraduation FROM "CareerPath" WHERE graduation ILIKE '%Data%' OR aftergraduation ILIKE '%Data%'`);
    console.log("CareerPaths mentioning Data:", cps.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
