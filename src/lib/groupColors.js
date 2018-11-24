/**
 * this assumes colorIds is an array that is no greater than GROUP_NUMBER_LIMITå
 * @param {Number[]} colorIds - color ids corresponding to colors - each group has one. the array
 * is guaranteed to be ascending
 * @returns {Number} next group color id
 */
export default function nextColorId(colorIds) {
  for (let i = 0; i < colorIds.length; i++) {
    if (i !== colorIds[i]) {
      return i;
    }
  }
  return colorIds.length;
}

/**
 * tests for jest when it works:
 * 1) empty array - []
 * 2) normal case (mixed ascending numbers) - [0,1,4,5]
 * 2.5) normal case not starting with 0 - [2,4,5]
 * 2.75) normal ascending case [1,2,3]
 * 3) 1 item with id of 0 - [0]
 * 4) 1 item with id of 3 [3]
 */

// @tutorial: https://facebook.github.io/react-native/docs/colors
export const colorIdtoColor = {
  0: 'red',
  1: 'dodgerblue',
  2: 'forestgreen',
  3: 'coral',
  4: 'purple',
  5: 'yellow',
  6: 'violet',
  7: 'lightsteelblue',
};
