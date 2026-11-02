import pg from 'pg';

async function checkNeon(name, url) {
  try {
    const pool = new pg.Pool({ connectionString: url });
    const cp = await pool.query('SELECT count(*) FROM "CareerPath"');
    const dt = await pool.query('SELECT count(*) FROM "Details"');
    const cat = await pool.query('SELECT count(*) FROM "Category"');
    const sub = await pool.query('SELECT count(*) FROM "Subcategory"');
    console.log(`${name}: CareerPath=${cp.rows[0].count}, Details=${dt.rows[0].count}, Category=${cat.rows[0].count}, Subcategory=${sub.rows[0].count}`);
    await pool.end();
  } catch (err) {
    console.log(`${name} error:`, err.message);
  }
}

async function main() {
  await checkNeon('Neon 1 (line 3)', "postgresql://neondb_owner:npg_KZ1Jvzopisl0@ep-damp-dust-aq7t3dtv.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require");
  await checkNeon('Neon 2 (line 5)', "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require");
}

main();
