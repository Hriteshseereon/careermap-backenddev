export const normalizeValue = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase();
};

export const getExcelValue = (
  row,
  column
) => {
  return row[column] !== undefined
    ? String(row[column]).trim()
    : "";
};