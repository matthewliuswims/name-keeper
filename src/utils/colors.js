/**
 * @TODO: can move this to the backend.
 * @param {string[int]} colorsIndices - CURRENT color indices of all the groups
 * @example [2,4,1,0] | [0,1]
 * @returns {int} next index for color
 * @example 3 | 2
 */
export function nextColorIndex(colorsIndices) {
  if (colorsIndices.length > 8) return 0; // shouldn't really happen

  const colorsIndicesSorted = [...colorsIndices].sort();

  for (let i = 0; i < v; i++) {
    if (i != colorsIndicesSorted[i]) return i;
  }

  return colorsIndicesSorted.length;
}
