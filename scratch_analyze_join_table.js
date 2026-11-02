import pg from 'pg';

const neonUrl = "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString: neonUrl });

async function main() {
  try {
    const res = await pool.query(`
      SELECT j."A" as cp_id, j."B" as detail_id,
             d."categoryId" as d_cat, d."secondcategoryId" as d_sec, d."subcategoryId" as d_sub,
             cp."categoryId" as cp_cat, cp."secondcategoryId" as cp_sec, cp."subcategoryId" as cp_sub,
             c.title as cat_name, cp."pathName", cp.graduation, cp.aftergraduation
      FROM "_CareerPathToDetails" j
      JOIN "Details" d ON j."B" = d.id
      JOIN "CareerPath" cp ON j."A" = cp.id
      LEFT JOIN "Category" c ON d."categoryId" = c.id
    `);

    let exactMatch = 0;
    let partialMatch = 0;
    let completeMismatch = 0;

    for (const r of res.rows) {
      const catMatch = r.d_cat === r.cp_cat;
      const secMatch = (r.d_sec === r.cp_sec) || (!r.d_sec && !r.cp_sec);
      const subMatch = (r.d_sub === r.cp_sub) || (!r.d_sub && !r.cp_sub);

      if (catMatch && secMatch && subMatch) {
        exactMatch++;
      } else if (catMatch) {
        partialMatch++;
      } else {
        completeMismatch++;
      }
    }

    console.log(`Total rows in _CareerPathToDetails: ${res.rows.length}`);
    console.log(`Exact hierarchy match: ${exactMatch}`);
    console.log(`Same Category but different Sec/Sub: ${partialMatch}`);
    console.log(`Complete Mismatch (different or null category): ${completeMismatch}`);

    // Let's also check if there are CareerPaths in CareerPath table that have categoryId/subcategoryId,
    // but are NOT linked to the corresponding Details!
    const unlinked = await pool.query(`
      SELECT cp.id as cp_id, cp."categoryId" as cp_cat, cp."secondcategoryId" as cp_sec, cp."subcategoryId" as cp_sub,
             d.id as detail_id
      FROM "CareerPath" cp
      JOIN "Details" d ON (
        (cp."subcategoryId" IS NOT NULL AND d."subcategoryId" = cp."subcategoryId")
        OR (cp."subcategoryId" IS NULL AND cp."secondcategoryId" IS NOT NULL AND d."secondcategoryId" = cp."secondcategoryId" AND d."subcategoryId" IS NULL)
        OR (cp."subcategoryId" IS NULL AND cp."secondcategoryId" IS NULL AND cp."categoryId" IS NOT NULL AND d."categoryId" = cp."categoryId" AND d."secondcategoryId" IS NULL AND d."subcategoryId" IS NULL)
      )
      LEFT JOIN "_CareerPathToDetails" j ON j."A" = cp.id AND j."B" = d.id
      WHERE j."A" IS NULL
    `);
    console.log(`CareerPaths that belong to a Details record by category hierarchy, but are NOT linked in _CareerPathToDetails: ${unlinked.rows.length}`);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
