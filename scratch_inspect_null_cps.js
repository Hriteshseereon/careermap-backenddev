import pg from 'pg';

const neonUrl = "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString: neonUrl });

async function main() {
  try {
    const res = await pool.query(`
      SELECT cp.id, cp."pathName", cp.graduation, cp.aftergraduation
      FROM "CareerPath" cp
      WHERE cp."categoryId" IS NULL AND cp."secondcategoryId" IS NULL AND cp."subcategoryId" IS NULL
      ORDER BY cp.id
    `);
    console.log(`Total CareerPaths with no category: ${res.rows.length}`);
    res.rows.forEach(r => {
      console.log(`CP #${r.id} "${r.pathName}": Grad: ${r.graduation} | After: ${r.aftergraduation}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
