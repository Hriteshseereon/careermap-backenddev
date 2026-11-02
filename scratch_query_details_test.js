import pg from 'pg';

const neonUrl = "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString: neonUrl });

async function main() {
  try {
    // Let's find several details records and check their careerpaths
    const details = await pool.query(`
      SELECT d.id, d."streamId", d."categoryId", c.title as cat_title,
             d."secondcategoryId", sc.name as sec_name,
             d."subcategoryId", sub.title as sub_title
      FROM "Details" d
      LEFT JOIN "Category" c ON d."categoryId" = c.id
      LEFT JOIN "Secondcategory" sc ON d."secondcategoryId" = sc.id
      LEFT JOIN "Subcategory" sub ON d."subcategoryId" = sub.id
      LIMIT 15
    `);

    for (const d of details.rows) {
      // Find career paths linked via join table
      const linkedPaths = await pool.query(`
        SELECT cp.id, cp."pathName", cp."categoryId", cp."secondcategoryId", cp."subcategoryId", cp."pathId", pt.pathtype, cp.graduation, cp.aftergraduation
        FROM "_CareerPathToDetails" j
        JOIN "CareerPath" cp ON j."A" = cp.id
        LEFT JOIN "PathType" pt ON cp."pathId" = pt.id
        WHERE j."B" = $1
      `, [d.id]);

      // Find career paths that actually match this category / secondcategory / subcategory directly on CareerPath table!
      const matchingPaths = await pool.query(`
        SELECT cp.id, cp."pathName", cp."categoryId", cp."secondcategoryId", cp."subcategoryId", cp."pathId", pt.pathtype, cp.graduation, cp.aftergraduation
        FROM "CareerPath" cp
        LEFT JOIN "PathType" pt ON cp."pathId" = pt.id
        WHERE ($1::int IS NULL OR cp."categoryId" = $1)
          AND ($2::int IS NULL OR cp."secondcategoryId" = $2)
          AND ($3::int IS NULL OR cp."subcategoryId" = $3)
      `, [d.categoryId, d.secondcategoryId, d.subcategoryId]);

      console.log(`\n==============================================`);
      console.log(`Details #${d.id}: Cat=[${d.categoryId}] "${d.cat_title}", Sec=[${d.secondcategoryId}] "${d.sec_name}", Sub=[${d.subcategoryId}] "${d.sub_title}"`);
      console.log(`  Linked in _CareerPathToDetails (${linkedPaths.rowCount}):`);
      linkedPaths.rows.forEach(p => {
        console.log(`    - CP #${p.id} "${p.pathName}" (cat=${p.categoryId}, sec=${p.secondcategoryId}, sub=${p.subcategoryId}) [Type: ${p.pathtype}] Grad: ${p.graduation} -> After: ${p.aftergraduation}`);
      });
      console.log(`  Matching CareerPath table by cat/sec/sub (${matchingPaths.rowCount}):`);
      matchingPaths.rows.forEach(p => {
        console.log(`    * CP #${p.id} "${p.pathName}" (cat=${p.categoryId}, sec=${p.secondcategoryId}, sub=${p.subcategoryId}) [Type: ${p.pathtype}] Grad: ${p.graduation} -> After: ${p.aftergraduation}`);
      });
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
