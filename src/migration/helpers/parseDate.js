const months = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

export function parseDate(value) {
  if (!value) return null;

  // Already a Date object
  if (value instanceof Date) return value;

  // Try normal parsing first
  const normalDate = new Date(value);

  if (!isNaN(normalDate.getTime())) {
    return normalDate;
  }

  // Handle "JANUARY 2025"
  const parts = value.trim().toLowerCase().split(/\s+/);

  if (parts.length === 2) {
    const month = months[parts[0]];
    const year = Number(parts[1]);

    if (month !== undefined && !isNaN(year)) {
      return new Date(year, month, 1);
    }
  }

  return null;
}