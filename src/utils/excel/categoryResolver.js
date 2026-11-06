const cleanText = (str) => {
  if (!str) return "";
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\//g, " or ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// Damerau-Levenshtein (optimal string alignment): a swapped pair like
// "Medcial" -> "Medical" costs 1, so Excel typos still resolve.
const editDistance = (a, b) => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[a.length][b.length];
};

// Exact (cleaned) match first, then the single closest candidate within a
// small typo tolerance. Ambiguous ties return null instead of guessing.
const pickBest = (raw, candidates) => {
  const target = cleanText(raw);
  if (!target) return null;

  const exact = candidates.find((c) => c.key === target);
  if (exact) return exact.id;

  if (target.length < 5) return null;

  const maxDistance = Math.max(1, Math.floor(target.length * 0.15));
  let best = null;
  let bestDistance = Infinity;
  let tied = false;

  for (const c of candidates) {
    const d = editDistance(target, c.key);
    if (d < bestDistance) {
      best = c;
      bestDistance = d;
      tied = false;
    } else if (d === bestDistance) {
      tied = true;
    }
  }

  return best && bestDistance <= maxDistance && !tied ? best.id : null;
};

export const createCategoryResolver = ({
  categories,
  secondCategories,
  subcategories,
}) => {
  const cats = categories.map((c) => ({ id: c.id, key: cleanText(c.title) }));
  const secs = secondCategories.map((s) => ({
    id: s.id,
    categoryId: s.categoryId,
    key: cleanText(s.name),
  }));
  const subs = subcategories.map((s) => ({
    id: s.id,
    categoryId: s.categoryId,
    secondcategoryId: s.secondcategoryId,
    key: cleanText(s.title),
  }));

  return (rawCategory, rawSecondary, rawSubCategory) => {
    const categoryId = pickBest(rawCategory, cats);

    const secondcategoryId =
      categoryId && rawSecondary
        ? pickBest(
            rawSecondary,
            secs.filter((s) => s.categoryId === categoryId)
          )
        : null;

    const subcategoryId =
      secondcategoryId && rawSubCategory
        ? pickBest(
            rawSubCategory,
            subs.filter((s) => s.secondcategoryId === secondcategoryId)
          )
        : null;

    return { categoryId, secondcategoryId, subcategoryId };
  };
};
