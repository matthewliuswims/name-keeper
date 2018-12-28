
// @TODO: better way to do this?

// @tutorial: https://facebook.github.io/react-native/docs/colors

export const colors = [
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
 * @param {string[]} groupColors - current colors of all the groups (ordered)
 * @returns {string} next group color
 */
export function nextColor(groupColors) {
  for (let i = 0; i < colors.length; i++) {
    if (colors[i] !== groupColors[i]) {
      return colors[i];
    }
  }
}

/**
 * For this case, we can always assume that groups will be >1
 * because the caller of this is a group container, which means
 * that at least 1 group exists
 * @param {string} groupName - groupName we are interested in finding color for
 * @param {[]Object} groups - all groups that exist, can assume this will always have length > 1.
 * can assume names in groups are all unique.
 * @return {string} color for groupName
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
