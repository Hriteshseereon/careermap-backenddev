import XLSX from "xlsx";

export const parseInstitutionExcel = (buffer) => {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
  });

  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("Excel sheet not found");
  }

  const worksheet = workbook.Sheets[sheetName];

  // Merged cells only keep their value in the top-left cell (e.g. one "Bihar"
  // over all Bihar rows); copy it into the rest so every row has its value.
  for (const merge of worksheet["!merges"] || []) {
    const source = worksheet[XLSX.utils.encode_cell(merge.s)];
    if (!source) continue;

    for (let r = merge.s.r; r <= merge.e.r; r++) {
      for (let c = merge.s.c; c <= merge.e.c; c++) {
        if (r === merge.s.r && c === merge.s.c) continue;
        worksheet[XLSX.utils.encode_cell({ r, c })] = { ...source };
      }
    }
  }

  const rows = XLSX.utils.sheet_to_json(
    worksheet,
    {
      defval: "",
      raw: false,
    }
  );

  return rows;
};