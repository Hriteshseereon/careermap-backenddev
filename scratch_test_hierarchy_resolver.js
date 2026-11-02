import pg from 'pg';

const neonUrl = "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString: neonUrl });

async function getCareerPathsForDetail(client, detail) {
  const { categoryId, secondcategoryId, subcategoryId } = detail;

  // 1. Try matching subcategoryId if present
  if (subcategoryId) {
    const res = await client.query(`
      SELECT cp.*, row_to_json(m.*) as module, row_to_json(pt.*) as path
      FROM "CareerPath" cp
      LEFT JOIN "Module" m ON cp."moduleId" = m.id
      LEFT JOIN "PathType" pt ON cp."pathId" = pt.id
      WHERE cp."subcategoryId" = $1
    `, [subcategoryId]);
    if (res.rows.length > 0) return res.rows;
  }

  // 2. Try matching secondcategoryId if present
  if (secondcategoryId) {
    const res = await client.query(`
      SELECT cp.*, row_to_json(m.*) as module, row_to_json(pt.*) as path
      FROM "CareerPath" cp
      LEFT JOIN "Module" m ON cp."moduleId" = m.id
      LEFT JOIN "PathType" pt ON cp."pathId" = pt.id
      WHERE cp."secondcategoryId" = $1
    `, [secondcategoryId]);
    if (res.rows.length > 0) return res.rows;
  }

  // 3. Try matching categoryId if present (where secondcategory and subcategory are null)
  if (categoryId) {
    const res = await client.query(`
      SELECT cp.*, row_to_json(m.*) as module, row_to_json(pt.*) as path
      FROM "CareerPath" cp
      LEFT JOIN "Module" m ON cp."moduleId" = m.id
      LEFT JOIN "PathType" pt ON cp."pathId" = pt.id
      WHERE cp."categoryId" = $1 AND cp."secondcategoryId" IS NULL AND cp."subcategoryId" IS NULL
    `, [categoryId]);
    if (res.rows.length > 0) return res.rows;
  }

  return [];
}

async function main() {
  try {
    // Test on previously broken Details
    // Detail 1: Medical / MBBS
    // Detail 17: Engineering
    // Detail 26: Architecture
    // Detail 55: Event Management
    // Detail 2: BDS
    const testIds = [1, 2, 17, 26, 27, 45, 55, 58];
    for (const id of testIds) {
      const dRes = await pool.query(`
        SELECT d.id, d."categoryId", c.title as cat, d."secondcategoryId", sc.name as sec, d."subcategoryId", sub.title as sub
        FROM "Details" d
        LEFT JOIN "Category" c ON d."categoryId" = c.id
        LEFT JOIN "Secondcategory" sc ON d."secondcategoryId" = sc.id
        LEFT JOIN "Subcategory" sub ON d."subcategoryId" = sub.id
        WHERE d.id = $1
      `, [id]);
      if (dRes.rows.length === 0) continue;
      const d = dRes.rows[0];
      const paths = await getCareerPathsForDetail(pool, d);
      console.log(`\n======================================================`);
      console.log(`Detail #${d.id} [Cat: "${d.cat}", Sec: "${d.sec}", Sub: "${d.sub}"]`);
      console.log(`Found ${paths.length} CareerPaths:`);
      paths.forEach(p => {
        console.log(`  - #${p.id} "${p.pathName}" (cat=${p.categoryId}, sec=${p.secondcategoryId}, sub=${p.subcategoryId}): ${p.graduation} -> ${p.aftergraduation}`);
      });
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
