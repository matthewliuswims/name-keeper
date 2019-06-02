// @tutorial: https://facebook.github.io/react-native/docs/colors

import colorPalette from '../assets/styles/colors';

// NOTE: anytime I make one change to the colors,
// I need to create a new version!

const colors = [
  colorPalette.firstGroupColor,
  colorPalette.secondGroupColor,
  colorPalette.thirdGroupColor,
  colorPalette.fourthGroupColor,
  colorPalette.fifthGroupColor,
  colorPalette.sixthGroupColor,
  colorPalette.seventhGroupColor,
  colorPalette.eighthGroupColor,
];

const versionOneColors = [
  colorPalette.versionOneFirstGroupColor,
  colorPalette.versionOneSecondGroupColor,
  colorPalette.versionOneThirdGroupColor,
  colorPalette.versionOneFourthGroupColor,
  colorPalette.versionOneFifthGroupColor,
  colorPalette.versionOneSixthGroupColor,
  colorPalette.versionOneSeventhGroupColor,
  colorPalette.versionOneEighthGroupColor,
];

// NOTE: order matters. Most recent version should always be first
export const arrayOfVersions = [
  colors,
  versionOneColors,
];

/**
 * helper func for nextColor().
 * @param {string[]} groupColors - CURRENT colors of all the groups (unordered from redux)
 *   @example ['silver','red','yellow']
 * @param {string[]} colorVersion - the 8 colors of all the groups
 *   @example versionOneColors or coloors
 * @return {string[]} - groupColors are now ordered by position (based on above colorsToPosition mapping)
 *   @example ['red', 'silver', 'yellow']
 */
function orderColors(groupColors, colorVersion) {
  const orderedColors = groupColors.slice().sort((a, b) => {
    return colorVersion.findIndex(color => color === a) - colorVersion.findIndex(color => color === b);
  });

  return orderedColors;
}

/**
 * called in GroupsDB to get the next group color for a newly created group.
 *
 * this func assumes groupColors is an array that is no greater than GROUP_NUMBER_LIMIT
 *
 * @param {string[]} groupColors - CURRENT colors of all the groups (unordered from redux)
 * @returns {string} next group color for a NEW group
 */
export function nextColor(groupColors) {
  // colorVersion is an array @example versionOneColors
  // if groupsColors is empty, then we'll take the first arrayOfVersions
  const colorVersion = arrayOfVersions.find((colVersion) => {
    // check to see if colVersion includes all the groupColors
    return groupColors.every(grpColor => colVersion.includes(grpColor));
  });

  if (!colorVersion) {
    // UI should not actually see this message
    throw Error(`FATAL: Color version could not be determined with these versions: ${arrayOfVersions}; and these group colors: ${groupColors}`);
  }

  const groupColorsOrdered = orderColors(groupColors, colorVersion);

  for (let i = 0; i < colorVersion.length; i++) {
    if (colorVersion[i] !== groupColorsOrdered[i]) {
      return colorVersion[i];
    }
  }
}

/**
 * For this case, we can always assume that groups will be >1
 * because the caller of this is a group container, which means
 * that at least 1 group exists
 * @param {string} groupName - groupName we are interested in finding color for
 * @param {[]Object} groups - all groups (unordered) that exist, can assume this will always have length > 1.
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
  const foundGroup = groups.find(group => group.name === groupName);

  if (foundGroup) return foundGroup.color;

  throw new Error('Could not get the group color for a group name');
}
