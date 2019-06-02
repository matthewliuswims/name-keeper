import { nextColor, getGroupColor } from '../src/lib/groupColors';

import colorPalette from '../src/assets/styles/colors';

// nextColor Tests
test('Next color works if no group colors - should just give 1st color', () => {
  expect(nextColor([])).toBe(colorPalette.firstGroupColor);
});

test('Next color when the first color is there', () => {
  expect(nextColor([colorPalette.firstGroupColor])).toBe(colorPalette.secondGroupColor);
});

test('Next color works for an ordered "normal" case where the groupColors is ordered as original', () => {
  expect(nextColor([colorPalette.firstGroupColor, colorPalette.secondGroupColor])).toBe(colorPalette.thirdGroupColor);
});

test('Next color works for an unordered case where the groupColors is NOT ordered as original, because a group got deleted', () => {
  expect(nextColor([colorPalette.firstGroupColor, colorPalette.seventhGroupColor])).toBe(colorPalette.secondGroupColor);
});

test('Next color works a completely unordered case', () => {
  expect(nextColor([colorPalette.seventhGroupColor, colorPalette.thirdGroupColor, colorPalette.firstGroupColor])).toBe(colorPalette.secondGroupColor);
});

test('Next color works a normal unordered case', () => {
  expect(nextColor([colorPalette.firstGroupColor, colorPalette.secondGroupColor, colorPalette.fourthGroupColor])).toBe(colorPalette.thirdGroupColor);
});

test('Next color works when we only have the last color', () => {
  expect(nextColor([colorPalette.eighthGroupColor])).toBe(colorPalette.firstGroupColor);
});

// getGroupColor Tests
const oneGroup = [
  {
    name: 'joe',
    color: colorPalette.firstGroupColor,
  },
];

test('correctly get group color for one group', () => {
  expect(getGroupColor('joe', oneGroup)).toBe(colorPalette.firstGroupColor);
});

// means a group was not deleted
const multiGroupsWithOriginalColorOrder = [
  {
    name: 'joe',
    color: colorPalette.firstGroupColor,
  },
  {
    name: 'Billy',
    color: colorPalette.secondGroupColor,
  },
];


test('correctly get group color for groups where original order is preserved', () => {
  expect(getGroupColor('Billy', multiGroupsWithOriginalColorOrder)).toBe(colorPalette.secondGroupColor);
});

// means a group was deleted
const multiGroupsWithNotOriginalColorOrder = [
  {
    name: 'joe',
    color: colorPalette.secondGroupColor,
  },
  {
    name: 'Billy',
    color: colorPalette.fifthGroupColor,
  },
  {
    name: 'Lilly',
    color: colorPalette.thirdGroupColor,
  },
];

test('correctly get group color for groups where original order is not preserved', () => {
  expect(getGroupColor('Lilly', multiGroupsWithNotOriginalColorOrder)).toBe(colorPalette.thirdGroupColor);
});

// test old colors

// nextColor Tests
test('Next version 1 color when the first color is old', () => {
  expect(nextColor([colorPalette.versionOneFirstGroupColor])).toBe(colorPalette.versionOneSecondGroupColor);
});

test('Next version 1 color works for an ordered "normal" case where the groupColors is ordered as original', () => {
  expect(nextColor([colorPalette.versionOneFirstGroupColor, colorPalette.versionOneSecondGroupColor])).toBe(colorPalette.versionOneThirdGroupColor);
});

test('Next version 1 color works for an unordered case where the groupColors is NOT ordered as original, because a group got deleted', () => {
  expect(nextColor([colorPalette.versionOneFirstGroupColor, colorPalette.versionOneSeventhGroupColor])).toBe(colorPalette.versionOneSecondGroupColor);
});

test('Next version 1 color works a completely unordered case', () => {
  expect(nextColor([colorPalette.versionOneSeventhGroupColor, colorPalette.versionOneThirdGroupColor, colorPalette.versionOneFirstGroupColor])).toBe(colorPalette.versionOneSecondGroupColor);
});

test('Next version 1 color works a normal unordered case', () => {
  expect(nextColor([colorPalette.versionOneFirstGroupColor, colorPalette.versionOneSecondGroupColor, colorPalette.versionOneFourthGroupColor])).toBe(colorPalette.versionOneThirdGroupColor);
});

test('Next version 1 color works when we only have the last color', () => {
  expect(nextColor([colorPalette.versionOneEighthGroupColor])).toBe(colorPalette.versionOneFirstGroupColor);
});

test('Mixing colors of 2 versions should thrw err', () => {
  expect(() => {
    nextColor([colorPalette.versionOneEighthGroupColor, colorPalette.firstGroupColor]);
  }).toThrowError('FATAL: Color version could not be determined with these versions: darkred,#512885,darkseagreen,chocolate,goldenrod,orchid,darkorange,lightsteelblue,red,purple,forestgreen,coral,silver,yellow,violet,mediumvioletred; and these group colors: mediumvioletred,darkred');
});
