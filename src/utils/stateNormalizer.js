const clean = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s/]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const CANONICAL_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// Spelling variants and cities found in the Institutions.state column.
const ALIASES = {
  orissa: "Odisha",
  tamilnadu: "Tamil Nadu",
  uttaranchal: "Uttarakhand",
  uttrakhand: "Uttarakhand",
  utrakhand: "Uttarakhand",
  chhatishgarh: "Chhattisgarh",
  chhatisgarh: "Chhattisgarh",
  "telangana state": "Telangana",
  pondicherry: "Puducherry",
  "pondicherry/puducherry": "Puducherry",
  "andaman and nicobar": "Andaman and Nicobar Islands",
  "andaman nicobar": "Andaman and Nicobar Islands",
  "andaman nicobar islands": "Andaman and Nicobar Islands",
  "andaman nicober islands": "Andaman and Nicobar Islands",
  "dadra and nagar haveli": "Dadra and Nagar Haveli and Daman and Diu",
  "daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
  "delhi ncr": "Delhi",
  "new delhi": "Delhi",
  mumbai: "Maharashtra",
  pune: "Maharashtra",
  kolkata: "West Bengal",
  hyderabad: "Telangana",
  bengaluru: "Karnataka",
  chennai: "Tamil Nadu",
  coimbatore: "Tamil Nadu",
  ghaziabad: "Uttar Pradesh",
  noida: "Uttar Pradesh",
  lucknow: "Uttar Pradesh",
  jaipur: "Rajasthan",
  bhubaneswar: "Odisha",
  patna: "Bihar",
  ahmedabad: "Gujarat",
  gurugram: "Haryana",
  indore: "Madhya Pradesh",
};

const LOOKUP = new Map([
  ...CANONICAL_STATES.map((s) => [clean(s), s]),
  ...Object.entries(ALIASES).map(([alias, state]) => [clean(alias), state]),
]);

/**
 * Returns the canonical state name for any raw spelling ("ODISHA", "Orissa",
 * "Bhubaneswar" -> "Odisha"), or null when the value is not a state
 * (null, "Pan India", "Coaching (Online/Offline)", ...).
 */
export const canonicalState = (raw) => LOOKUP.get(clean(raw)) || null;
