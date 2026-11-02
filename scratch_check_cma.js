import pg from 'pg';

const neonUrl = "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString: neonUrl });

async function main() {
  try {
    const res = await pool.query(`
      SELECT cp.id, cp."pathName", cp."categoryId", c.title as cat_title, cp."secondcategoryId", sc.name as sec_name, cp."subcategoryId", cp.graduation, cp.aftergraduation
      FROM "CareerPath" cp
      LEFT JOIN "Category" c ON cp."categoryId" = c.id
      LEFT JOIN "Secondcategory" sc ON cp."secondcategoryId" = sc.id
      WHERE cp.id IN (87, 88, 89, 90, 182, 183, 184, 185)
    `);
    console.log("CMA & Lecturer CareerPaths in DB:", res.rows);

    // Let's also check Category IDs for CMA and Lecturer / Professor
    const catRes = await pool.query(`
      SELECT id, title FROM "Category" WHERE title ILIKE '%CMA%' OR title ILIKE '%Cost%' OR title ILIKE '%Lecturer%' OR title ILIKE '%Professor%'
    `);
    console.log("Categories for CMA and Lecturer:", catRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
