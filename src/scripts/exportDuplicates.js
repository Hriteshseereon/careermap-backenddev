import fs from "fs";
import path from "path";
import XLSX from "xlsx";

function exportDuplicates() {
  console.log("==========================================================");
  console.log("🔍 EXTRACTING DUPLICATE INSTITUTIONS FROM EXCEL");
  console.log("==========================================================\n");

  const cwd = process.cwd();
  let filePath = path.join(cwd, "Institution.xlsx");
  if (!fs.existsSync(filePath)) {
    filePath = path.join(cwd, "institution.xlsx");
  }

  if (!fs.existsSync(filePath)) {
    console.error("❌ File not found at:", filePath);
    process.exit(1);
  }

  console.log(`📖 Reading Excel file: ${filePath}`);
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
  console.log(`📊 Total rows in Excel: ${rows.length}`);

  // Track occurrences
  const seenMap = new Map(); // normalizedName -> { firstRowIndex, firstRowData, count }
  const duplicateRows = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const excelRowNum = i + 2; // Row 1 is header
    const instituteName = String(row["INSTITUTE"] || "").trim();

    if (!instituteName) {
      continue;
    }

    const normalizedName = instituteName.toLowerCase();

    if (seenMap.has(normalizedName)) {
      const original = seenMap.get(normalizedName);
      original.count++;

      duplicateRows.push({
        "DUPLICATE_EXCEL_ROW": excelRowNum,
        "ORIGINAL_EXCEL_ROW": original.firstRowIndex,
        "DUPLICATE_COUNT": original.count,
        "ORIGINAL_STATE": original.firstRowData["STATE"] || "",
        "ORIGINAL_STREAM": original.firstRowData["STREAM"] || "",
        "ORIGINAL_CATEGORY": original.firstRowData["CATEGORY"] || "",
        "INSTITUTE": instituteName,
        "STREAM": row["STREAM"] || "",
        "CATEGORY": row["CATEGORY"] || "",
        "SECONDARY CATEGORY": row["SECONDARY CATEGORY"] || "",
        "SUB CATEGORY": row["SUB CATEGORY"] || "",
        "TYPE": row["TYPE"] || "",
        "STATE": row["STATE"] || "",
        "CITY": row["CITY"] || "",
        "DISTRICT": row["DISTRICT"] || "",
        "COUNTRY": row["COUNTRY"] || "",
        "ADDRESS": row["ADDRESS"] || "",
        "WEBSITE LINK": row["WEBSITE LINK"] || "",
        "COURSE OFFERED": row["COURSE OFFERED"] || "",
      });
    } else {
      seenMap.set(normalizedName, {
        firstRowIndex: excelRowNum,
        firstRowData: row,
        count: 1,
      });
    }
  }

  console.log(`\n🚨 Total Duplicate Rows Identified: ${duplicateRows.length}`);

  // Create new Workbook
  const newWb = XLSX.utils.book_new();
  const newWs = XLSX.utils.json_to_sheet(duplicateRows);
  XLSX.utils.book_append_sheet(newWb, newWs, "Duplicates");

  const outputPath = path.join(cwd, "duplicate_institutions.xlsx");
  XLSX.writeFile(newWb, outputPath);

  console.log(`\n💾 Saved duplicate institutions file to:`);
  console.log(`   ${outputPath}`);
  console.log("==========================================================\n");
}

exportDuplicates();

