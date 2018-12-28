import { colors, nextColor, getGroupColor } from '../src/lib/groupColors';

// nextColor Tests
test('Next color works if no group colors - should just give 1st color', () => {
  expect(nextColor([])).toBe(colors[0]);
});

test('Next color works for an ordered "normal" case where the groupColors is ordered as original', () => {
  expect(nextColor(['red', 'dodgerblue'])).toBe(colors[2]);
});

test('Next color works for an unordered case where the groupColors is NOT ordered as original, because a group got deleted', () => {
  expect(nextColor(['red', 'coral'])).toBe(colors[1]);
});

// getGroupColor Tests
const oneGroup = [
  {
    name: 'joe',
    color: 'red',
  },
];

test('correctly get group color for one group', () => {
  expect(getGroupColor('joe', oneGroup)).toBe('red');
});

// means a group was not deleted
const multiGroupsWithOriginalColorOrder = [
  {
    name: 'joe',
    color: 'red',
  },
  {
    name: 'Billy',
    color: 'dodgerblue',
  },
];


test('correctly get group color for groups where original order is preserved', () => {
  expect(getGroupColor('Billy', multiGroupsWithOriginalColorOrder)).toBe('dodgerblue');
});

// means a group was deleted
const multiGroupsWithNotOriginalColorOrder = [
  {
    name: 'joe',
    color: 'forestgreen',
  },
  {
    name: 'Billy',
    color: 'purple',
  },
  {
    name: 'Lilly',
    color: 'violet',
  },
];

test('correctly get group color for groups where original order is not preserved', () => {
  expect(getGroupColor('Lilly', multiGroupsWithNotOriginalColorOrder)).toBe('violet');
});
