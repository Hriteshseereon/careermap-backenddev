import pg from 'pg';

const neonUrl = "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString: neonUrl });

async function main() {
  try {
    // Check Category 34 careerpaths
    const cp34 = await pool.query(`
      SELECT cp.id, cp."pathName", cp."categoryId", cp."secondcategoryId", cp."subcategoryId", cp.graduation, cp.aftergraduation
      FROM "CareerPath" cp
      WHERE cp."categoryId" = 34
    `);
    console.log("CareerPaths with categoryId = 34 (Event Management):", cp34.rows);

    // Check Category 12 careerpaths (Data Science)
    const cp12 = await pool.query(`
      SELECT cp.id, cp."pathName", cp."categoryId", cp."secondcategoryId", cp."subcategoryId", cp.graduation, cp.aftergraduation
      FROM "CareerPath" cp
      WHERE cp."categoryId" = 12
    `);
    console.log("CareerPaths with categoryId = 12 (Data Science):", cp12.rows);

    // Check Category 2 careerpaths (Engineering)
    const cp2 = await pool.query(`
      SELECT cp.id, cp."pathName", cp."categoryId", cp."secondcategoryId", cp."subcategoryId", cp.graduation, cp.aftergraduation
      FROM "CareerPath" cp
      WHERE cp."categoryId" = 2
    `);
    console.log("CareerPaths with categoryId = 2 (Engineering):", cp2.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
