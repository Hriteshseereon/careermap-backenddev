import pg from 'pg';

const neonUrl = "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString: neonUrl });

async function main() {
  try {
    // 1. Check join table _CareerPathToDetails
    const joinTableRes = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = '_CareerPathToDetails'
    `);
    console.log("Join table columns:", joinTableRes.rows);

    const joinCount = await pool.query('SELECT count(*) FROM "_CareerPathToDetails"');
    console.log('Total entries in _CareerPathToDetails:', joinCount.rows[0].count);

    // 2. Sample from join table
    const joinSample = await pool.query('SELECT * FROM "_CareerPathToDetails" LIMIT 10');
    console.log('Sample join table rows:', joinSample.rows);

    // 3. Inspect details with connected career paths vs details category/subcategory
    const detailsWithPaths = await pool.query(`
      SELECT d.id as "detailsId", d."streamId", d."categoryId", d."secondcategoryId", d."subcategoryId",
             cp.id as "cpId", cp."pathName", cp."categoryId" as "cpCatId", cp."secondcategoryId" as "cpSecId", cp."subcategoryId" as "cpSubId"
      FROM "_CareerPathToDetails" j
      JOIN "Details" d ON j."B" = d.id
      JOIN "CareerPath" cp ON j."A" = cp.id
      LIMIT 20
    `);
    console.log('Details joined with CareerPath (via join table):', detailsWithPaths.rows);

    // 4. Check if CareerPath itself has categoryId / secondcategoryId / subcategoryId
    const cpWithCat = await pool.query(`
      SELECT count(*) filter (where "categoryId" is not null) as has_cat,
             count(*) filter (where "secondcategoryId" is not null) as has_sec,
             count(*) filter (where "subcategoryId" is not null) as has_sub,
             count(*) as total
      FROM "CareerPath"
    `);
    console.log('CareerPath category distribution:', cpWithCat.rows[0]);

    // 5. Sample career paths directly
    const cpSample = await pool.query(`
      SELECT id, "pathName", "categoryId", "secondcategoryId", "subcategoryId", "pathId", graduation, aftergraduation
      FROM "CareerPath"
      LIMIT 5
    `);
    console.log('Sample CareerPaths:', cpSample.rows);

    // 6. Check mismatch between Details category/subcategory and CareerPath category/subcategory for connected rows
    const mismatch = await pool.query(`
      SELECT d.id as "detailsId", d."categoryId" as "d_cat", d."subcategoryId" as "d_sub",
             cp.id as "cpId", cp."categoryId" as "cp_cat", cp."subcategoryId" as "cp_sub"
      FROM "_CareerPathToDetails" j
      JOIN "Details" d ON j."B" = d.id
      JOIN "CareerPath" cp ON j."A" = cp.id
      WHERE (d."categoryId" IS DISTINCT FROM cp."categoryId" AND cp."categoryId" IS NOT NULL)
         OR (d."subcategoryId" IS DISTINCT FROM cp."subcategoryId" AND cp."subcategoryId" IS NOT NULL)
      LIMIT 10
    `);
    console.log('Mismatches count:', mismatch.rowCount, 'Sample mismatches:', mismatch.rows);

    // 7. Check how many details have careerpaths connected
    const detailsStats = await pool.query(`
      SELECT 
        count(DISTINCT d.id) as details_with_paths,
        (SELECT count(*) FROM "Details") as total_details
      FROM "Details" d
      JOIN "_CareerPathToDetails" j ON j."B" = d.id
    `);
    console.log('Details stats:', detailsStats.rows[0]);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
