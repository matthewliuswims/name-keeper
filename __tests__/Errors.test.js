import { getMessage } from '../src/lib/errors/errors';
import { PLACE_HOLDER_DEFAULT, DUPLICATE_GROUP_NAME } from '../src/lib/errors/overrides';

const errMsgSql = 'Error code 19: UNIQUE constraint failed: groups.name at massageError (blob:http://localhost:19001/8349e760-33ac-4297-9a8d-b1599e3927';

test('getMessage works for normal error code of user trying to add a group that already exists', () => {
  const err = new Error(errMsgSql);
  expect(getMessage(err)).toBe(PLACE_HOLDER_DEFAULT.message);
});

test('getMessage works with overrides', () => {
  const err = new Error(errMsgSql);
  expect(getMessage(err, DUPLICATE_GROUP_NAME)).toBe(DUPLICATE_GROUP_NAME.message);
});

test('getMessage works with a non-sql err', () => {
  const err = new Error('non sql err msg');
  expect(getMessage(err)).toBe(PLACE_HOLDER_DEFAULT.message);
});


test('getMessage works with a non-sql err - BUT has an err hook msg', () => {
  const err = new Error('UNIQUE CONSTAINT FAILED');
  expect(getMessage(err, DUPLICATE_GROUP_NAME)).toBe(DUPLICATE_GROUP_NAME.message);
});

test('getMessage will give default message if the errMsg is not a duplicate group name kind', () => {
  const err = new Error('non sql err msg');
  expect(getMessage(err, DUPLICATE_GROUP_NAME)).toBe(PLACE_HOLDER_DEFAULT.message);
});

test('getMessage works with a non-sql err and an overrides', () => {
  const err = new Error('non sql err msg');
  expect(getMessage(err, DUPLICATE_GROUP_NAME)).toBe(PLACE_HOLDER_DEFAULT.message);
});
