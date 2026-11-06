import "dotenv/config";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import prisma from "../config/db.js";

async function inspect() {
  try {
    const cwd = process.cwd();
    let filePath = path.join(cwd, "Institution.xlsx");
    if (!fs.existsSync(filePath)) {
      filePath = path.join(cwd, "institution.xlsx");
    }

    if (!fs.existsSync(filePath)) {
      console.error("❌ File not found at:", filePath);
      process.exit(1);
    }

    console.log("📁 Reading Excel file from:", filePath);
    const stats = fs.statSync(filePath);
    console.log(`📦 File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

    const workbook = XLSX.readFile(filePath, { cellDates: true });
    console.log("📋 Sheet Names:", workbook.SheetNames);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    console.log(`📊 Total Rows found: ${rows.length}`);

    if (rows.length > 0) {
      console.log("\n🔑 Detected Columns / Headers:");
      console.log(Object.keys(rows[0]));

      console.log("\n📝 First 2 Sample Rows:");
      console.log(JSON.stringify(rows.slice(0, 2), null, 2));
    }

    // Check DB existing institution count
    const currentCount = await prisma.institutions.count();
    console.log(`\n🏢 Current Institutions in Database: ${currentCount}`);

    // Check streams in DB
    const streams = await prisma.stream.findMany({ select: { id: true, name: true } });
    console.log(`🌊 Streams in DB (${streams.length}):`, streams.map(s => s.name));

  } catch (error) {
    console.error("❌ Inspection Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

inspect();

