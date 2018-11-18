
import { PLACE_HOLDER_DEFAULT } from './overrides';
/**
 * @param {object} error - error from redux
 * @param {object} [overrides] - optional overrides object
 * @returns {object} message - message from error
 */
export default function getMessage(error, overrides) {
  if (overrides && overrides.default) {
    return overrides.message;
  }

  if (statusCodeMatchesSQLError(error, overrides)) {
    return overrides.message;
  }

  return PLACE_HOLDER_DEFAULT.message;
}

/**
 * if we have an overrides object, we need to see if the
 * errCode of said object matches the errCode given by an error.
 * (specifically a sql error)
 * If they match, then we show overrides object's msg,
 * else we don't
 * @param error - sql error given by redux
 *  - @example sql - 'Error code 19: UNIQUE constrain failed: groups.name'
 *
 * @param {object} [overrides] - optional overrides object
 */
function statusCodeMatchesSQLError(error, overrides) {
  if (!overrides) {
    return; // we return because there's no overrides to even compare to
  }
  const firstNumberRegex = /([0-9]+)/;
  // find the sql error code from the message
  const errorCode = firstNumberRegex.exec(error.message);

  if (errorCode && errorCode[0] === overrides.errCode) {
    return true;
  }
  return false;
}
