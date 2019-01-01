import {
  parseToShortDate,
  parseToLongDate,
} from '../src/lib/dates';

// parseToShortDate
test('parseToShortDate normal case test', () => {
  expect(parseToShortDate('2019-01-01T02:27:45.194Z')).toEqual('Mon, Dec 31st');
});

// parseToLongDate
test('parseToLongDate normal case test', () => {
  expect(parseToLongDate('2019-01-01T02:27:45.194Z')).toEqual('8:27 PM, Monday, December 31st, 2018');
});
