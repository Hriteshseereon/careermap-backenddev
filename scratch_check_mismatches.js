import pg from 'pg';

const neonUrl = "postgresql://neondb_owner:npg_gtT6PJCmcE1N@ep-gentle-mode-aefpvce2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString: neonUrl });

async function main() {
  try {
    const res = await pool.query(`
      SELECT 
        d.id as detail_id,
        d."streamId" as d_stream,
        d."categoryId" as d_cat,
        c.title as d_cat_title,
        d."secondcategoryId" as d_sec,
        sc.name as d_sec_name,
        d."subcategoryId" as d_sub,
        sub.title as d_sub_title,
        cp.id as cp_id,
        cp."pathName" as cp_name,
        cp."categoryId" as cp_cat,
        c_cp.title as cp_cat_title,
        cp."secondcategoryId" as cp_sec,
        sc_cp.name as cp_sec_name,
        cp."subcategoryId" as cp_sub,
        sub_cp.title as cp_sub_title,
        cp.graduation,
        cp.aftergraduation
      FROM "_CareerPathToDetails" j
      JOIN "Details" d ON j."B" = d.id
      JOIN "CareerPath" cp ON j."A" = cp.id
      LEFT JOIN "Category" c ON d."categoryId" = c.id
      LEFT JOIN "Secondcategory" sc ON d."secondcategoryId" = sc.id
      LEFT JOIN "Subcategory" sub ON d."subcategoryId" = sub.id
      LEFT JOIN "Category" c_cp ON cp."categoryId" = c_cp.id
      LEFT JOIN "Secondcategory" sc_cp ON cp."secondcategoryId" = sc_cp.id
      LEFT JOIN "Subcategory" sub_cp ON cp."subcategoryId" = sub_cp.id
      ORDER BY d.id, cp.id
    `);

    console.log(`Total connected careerpath-detail relations: ${res.rows.length}`);

    let mismatchCount = 0;
    const mismatches = [];

    for (const r of res.rows) {
      const catMismatch = r.d_cat !== r.cp_cat;
      const secMismatch = r.d_sec !== r.cp_sec;
      const subMismatch = r.d_sub !== r.cp_sub;

      if (catMismatch || secMismatch || subMismatch) {
        mismatchCount++;
        mismatches.push(r);
      }
    }

    console.log(`Total Mismatched relations: ${mismatchCount} out of ${res.rows.length}`);

    if (mismatchCount > 0) {
      console.log("\n--- Sample Mismatches ---");
      mismatches.slice(0, 30).forEach(m => {
        console.log(`Detail #${m.detail_id} [Stream:${m.d_stream}, Cat:${m.d_cat} "${m.d_cat_title}", Sec:${m.d_sec} "${m.d_sec_name}", Sub:${m.d_sub} "${m.d_sub_title}"]`);
        console.log(`  connected to CP #${m.cp_id} "${m.cp_name}" [Cat:${m.cp_cat} "${m.cp_cat_title}", Sec:${m.cp_sec} "${m.cp_sec_name}", Sub:${m.cp_sub} "${m.cp_sub_title}"] Grad: ${m.graduation} -> After: ${m.aftergraduation}`);
      });
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
