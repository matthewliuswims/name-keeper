
import { PLACE_HOLDER_DEFAULT } from './overrides';
/**
 * @param {object} error - error from redux
 * @param {object} [overrides] - optional overrides object
 *  errCode - code to match with the error's sql err code
 *  message - msg frm error
 *  errHook - a space delimited string, which we check to see if anything of the split parts is in the error message
 * @returns {object} message - message from the overrides object or the default message
 */
export default function getMessage(error, overrides) {
  if (overrides && overrides.default) {
    return overrides.message;
  }

  if (statusCodeMatchesSQLError(error, overrides)) {
    return overrides.message;
  }

  if (errHookIsInErrMsg(error, overrides)) {
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
    return false; // we return because there's no overrides to even compare to
  }
  const firstNumberRegex = /([0-9]+)/;
  // find the sql error code from the message
  const errorCode = firstNumberRegex.exec(error.message);

  if (errorCode && errorCode[0] === overrides.errCode) {
    return true;
  }
  return false;
}

function errHookIsInErrMsg(error, overrides) {
  if (!overrides.errHook) {
    return false;
  }

  const errMsgLowercase = error.message.toLowerCase();
  const overridesHookLowerCase = overrides.errHook.toLowerCase();
  const errHooksWordsArray = overridesHookLowerCase.split(' ');

  for (const hook of errHooksWordsArray) {
    if (errMsgLowercase.includes(hook)) {
      return true;
    }
  }

  return false;
}


// function statusCodeMatchesSQLError(error, overrides) {
//   if (!overrides) {
//     return; // we return because there's no overrides to even compare to
//   }
//   const firstNumberRegex = /([0-9]+)/;
//   // find the sql error code from the message
//   const errorCode = firstNumberRegex.exec(error.message);

//   if (errorCode && errorCode[0] === overrides.errCode) {
//     return true;
//   }
//   return false;
// }
