
// @TODO: better way to do this?

// @tutorial: https://facebook.github.io/react-native/docs/colors

const colors = [
  'red',
  'dodgerblue',
  'forestgreen',
  'coral',
  'purple',
  'yellow',
  'violet',
  'lightsteelblue',
];

/**
 * this assumes groupCOlors is an array that is no greater than GROUP_NUMBER_LIMITå
 * @param {Number[]} groupColors
 * @returns {Number} next group color id
 */
export function nextColor(groupColors) {
  for (let i = 0; i < colors.length; i++) {
    if (colors[i] !== groupColors[i]) {
      return colors[i];
    }
  }
}

// BLABLA FIX BELOW
/**
 * tests for jest when it works:
 * 1) empty array - []
 * 2) normal case (mixed ascending numbers) - [0,1,4,5]
 * 2.5) normal case not starting with 0 - [2,4,5]
 * 2.75) normal ascending case [0,1,2]
 * 3) 1 item with id of 0 - [0]
 * 4) 1 item with id of 3 [3]
 */


export function getGroupColor(groupName, groups) {
  for (const group of groups) {
    if (group.name === groupName) {
      return group.color;
    }
  }
  throw new Error('Could not get the group color for a group name');
}
