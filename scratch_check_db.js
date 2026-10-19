import prisma from "../src/config/db.js";

async function main() {
  try {
    const instCount = await prisma.institutions.count();
    console.log("Current Total Institutions in DB:", instCount);

    const categories = await prisma.category.findMany({
      select: { id: true, title: true }
    });
    console.log(`Total Categories in DB: ${categories.length}`);
    console.log("Categories:", categories.map(c => `[${c.id}] ${c.title}`));

    const secondCount = await prisma.secondcategory.count();
    console.log(`Total Second Categories in DB: ${secondCount}`);

    const subCount = await prisma.subcategory.count();
    console.log(`Total Subcategories in DB: ${subCount}`);
  } catch (err) {
    console.error("DB check error:", err);
  } finally {
    process.exit(0);
  }
}

main();
