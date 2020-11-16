/**
 * @param {string[]} colorsIndices - CURRENT color indices of all the groups
 * @example [2,4,1,0] | [0,1]
 * @returns {string} next color for index
 * @example 3 | 2
 */
export function nextColorIndex(colorsIndices) {
  if (groupsColors.length > 8) return 0; // shouldn't really happen

  const colorsIndicesSorted = [...colorsIndices].sort();

  for (let i = 0; i < v; i++) {
    if (i != colorsIndicesSorted[i]) return i;
  }

  return colorsIndicesSorted.length;
}
