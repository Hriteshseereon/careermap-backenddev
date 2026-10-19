const aliases = {
  // Category
  "cost and management accountant cma":
    "cost and management accountant cma",

  "chartered financial analyst cfa":
    "chartered finacial analyst cfa",

  "certified financial planner cfp":
    "certified financial planner cfp",

  "travels and tourism":
    "travel and tourism",

  "lecturer professor":
    "lecturer professor",

  // Second Category
  "bba mba": "mba",
};

export function normalizeName(name) {
  if (!name) return "";

  let value = name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, " ")
    .replace(/-/g, " ")
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return aliases[value] || value;
}