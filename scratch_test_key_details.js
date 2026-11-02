import pg from 'pg';

const neonUrl = "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString: neonUrl });

async function resolveDetail(client, d) {
  // 1. If detail has subcategoryId, check careerpath with that subcategoryId
  if (d.subcategoryId) {
    const res = await client.query(`
      SELECT cp.*, row_to_json(m.*) as module, row_to_json(pt.*) as path
      FROM "CareerPath" cp
      LEFT JOIN "Module" m ON cp."moduleId" = m.id
      LEFT JOIN "PathType" pt ON cp."pathId" = pt.id
      WHERE cp."subcategoryId" = $1
    `, [d.subcategoryId]);
    if (res.rows.length > 0) return res.rows;
  }

  // 2. If detail has secondcategoryId, check careerpath with that secondcategoryId
  if (d.secondcategoryId) {
    const res = await client.query(`
      SELECT cp.*, row_to_json(m.*) as module, row_to_json(pt.*) as path
      FROM "CareerPath" cp
      LEFT JOIN "Module" m ON cp."moduleId" = m.id
      LEFT JOIN "PathType" pt ON cp."pathId" = pt.id
      WHERE cp."secondcategoryId" = $1
    `, [d.secondcategoryId]);
    if (res.rows.length > 0) return res.rows;
  }

  // 3. If detail has categoryId, check careerpath matching that categoryId
  if (d.categoryId) {
    const res = await client.query(`
      SELECT cp.*, row_to_json(m.*) as module, row_to_json(pt.*) as path
      FROM "CareerPath" cp
      LEFT JOIN "Module" m ON cp."moduleId" = m.id
      LEFT JOIN "PathType" pt ON cp."pathId" = pt.id
      WHERE cp."categoryId" = $1 AND cp."secondcategoryId" IS NULL AND cp."subcategoryId" IS NULL
    `, [d.categoryId]);
    if (res.rows.length > 0) return res.rows;
  }

  // 4. Fallback: filter join table to strictly reject any careerpath from a different category
  const joinedRes = await client.query(`
    SELECT cp.*, row_to_json(m.*) as module, row_to_json(pt.*) as path
    FROM "_CareerPathToDetails" j
    JOIN "CareerPath" cp ON j."A" = cp.id
    LEFT JOIN "Module" m ON cp."moduleId" = m.id
    LEFT JOIN "PathType" pt ON cp."pathId" = pt.id
    WHERE j."B" = $1
  `, [d.id]);

  return joinedRes.rows.filter((cp) => {
    if (cp.categoryId && d.categoryId && cp.categoryId !== d.categoryId) return false;
    if (cp.secondcategoryId && d.secondcategoryId && cp.secondcategoryId !== d.secondcategoryId) return false;
    if (cp.subcategoryId && d.subcategoryId && cp.subcategoryId !== d.subcategoryId) return false;
    return true;
  });
}

async function main() {
  try {
    const ids = [1, 2, 17, 26, 27, 29, 45, 55, 58];
    for (const id of ids) {
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
      const paths = await resolveDetail(pool, d);
      console.log(`\nDetail #${d.id} [Cat: "${d.cat}", Sec: "${d.sec}", Sub: "${d.sub}"] -> ${paths.length} career paths:`);
      paths.forEach(p => console.log(`   - #${p.id} "${p.pathName}": ${p.graduation} -> ${p.aftergraduation}`));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
