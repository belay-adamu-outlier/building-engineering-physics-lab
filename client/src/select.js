/** Newest items by year, then id. */
export function pickLatest(items, count) {
  const list = Array.isArray(items) ? items : [];
  const size = Number.isInteger(count) && count > 0 ? count : 0;
  return [...list].sort((left, right) => {
    const yearGap = Number(right.year) - Number(left.year);
    if (yearGap !== 0) {
      return yearGap;
    }
    return String(right.id).localeCompare(String(left.id));
  }).slice(0, size);
}

/** Newest items by a date string that sorts lexicographically. */
export function sortByDateDesc(items) {
  const list = Array.isArray(items) ? items : [];
  return [...list].sort((left, right) => (
    String(right.date).localeCompare(String(left.date))
  ));
}
