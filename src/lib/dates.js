
import moment from 'moment';

/**
 * used to display the created date (abbreviated version) for a user
 * @param String dateAsStr - retrieved from SQLLITE DB
 *   @example: "2019-01-01T02:27:45.194Z"
 * @return parsed date as string
 *   @example Mon, Dec 31st
 */
export function parseToShortDate(dateAsStr) {
  const momentDate = moment(dateAsStr);
  const formattedDate = momentDate.format('ddd, MMM Do');
  return formattedDate;
}

/**
 * used to display the created date (longer version) for a user
 * @param String dateAsStr - retrieved from SQLLITE DB
 *   @example: "2019-01-01T02:27:45.194Z"
 * @return parsed date as string
 *   @example 8:27 PM, Mon, December 31st, 2018
 */
export function parseToLongDate(dateAsStr) {
  const momentDate = moment(dateAsStr);
  const formattedDate = momentDate.format('h:mmA, ddd, MMM Do, YYYY');
  return formattedDate;
}

/**
 * used for search screen - so when a user types in 'Monday' (as opposed to just mon)
 * then it'll show up.
 * @param String dateAsStr - retrieved from SQLLITE DB
 *   @example: "2019-01-01T02:27:45.194Z"
 * @return day of the week
 *   @example Monday
 */
export function getDayOfWeek(dateAsStr) {
  const momentDate = moment(dateAsStr);
  const dayOfWeek = momentDate.format('dddd');
  return dayOfWeek;
}
