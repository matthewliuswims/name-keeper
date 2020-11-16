/**
 * for creation screens whether or not to show a plus sign (or a remove sign)
 */
export function isPlus(index, lenFields) {
  if (lenFields <= 1) return true;
  if (index === lenFields - 1) return true;
  return false;
}
