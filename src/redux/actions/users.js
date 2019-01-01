
import moment from 'moment';

import UsersDB from '../../assets/database/UsersDB';
import { makeAction, turnUsersListGroupNamesIntoArray } from '../../lib/actions';

export const ADD_USER_START = 'ADD_USER_START';
export const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS';
export const ADD_USER_FAIL = 'ADD_USER_FAIL';

export const LIST_USERS_START = 'LIST_USERS_START';
export const LIST_USERS_SUCCESS = 'LIST_USERS_SUCCESS';
export const LIST_USERS_FAIL = 'LIST_USERS_FAIL';

export const LIST_ALL_USERS_START = 'LIST_ALL_USERS_START';
export const LIST_ALL_USERS_SUCCESS = 'LIST_ALL_USERS_SUCCESS';
export const LIST_ALL_USERS_FAIL = 'LIST_ALL_USERS_FAIL';

export const FOCUS_USER = 'FOCUS_USER'; // users.js reducers for details
export const CLEAR_USER_FOCUS = 'CLEAR_USER_FOCUS';

export const DELETE_USER_START = 'DELETE_USER_START';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAIL = 'DELETE_USER_FAIL';

export const EDIT_USER_START = 'EDIT_USER_START';
export const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS';
export const EDIT_USER_FAIL = 'EDIT_USER_FAIL';

export const CLEAR_ERRS_USER = 'CLEAR_ERRS_USER';

function parseDate(dateAsStr) {
  const momentDate = moment(dateAsStr);
  const formattedDate = momentDate.format('h:mm A, dddd, MMMM Do, YYYY');
  return formattedDate;
}

export function addUser(user) {
  return (dispatch) => {
    dispatch(makeAction(ADD_USER_START));

    return UsersDB.getInstance().then((userDBInstance) => {
      return userDBInstance.addUser(user);
    }).then(() => {
      dispatch(makeAction(ADD_USER_SUCCESS));
    }).catch((err) => {
      dispatch(makeAction(ADD_USER_FAIL, err));
      // no need to throw err in this particular instance because
      // ui won't do anything explictly if this part fails
    });
  };
}

/**
 * NOTE: container still has to list allusers to update the redux users
 */
export function deleteUser(user) {
  return async (dispatch) => {
    try {
      dispatch(makeAction(DELETE_USER_START));
      const usersDBInstance = await UsersDB.getInstance();
      await usersDBInstance.deleteUser(user);
      dispatch(makeAction(DELETE_USER_SUCCESS, user));
    } catch (err) {
      dispatch(makeAction(DELETE_USER_FAIL, err));
    }
  };
}

export function listAllUsers() {
  return (dispatch) => {
    dispatch(makeAction(LIST_ALL_USERS_START));
    return UsersDB.getInstance().then((usersDBInstance) => {
      return usersDBInstance.listAllUsers();
    }).then((usersList) => {
      const newUsersList = turnUsersListGroupNamesIntoArray(usersList);
      // this is so when we do searches, the search can find parsed dates as a substring
      const withParsedDates = newUsersList.map((user) => {
        const newUser = Object.assign({}, user, {
          readableCreatedDate: parseDate(user.createdDate),
        });
        return newUser;
      });
      dispatch(makeAction(LIST_ALL_USERS_SUCCESS, withParsedDates));
    }).catch((error) => {
      dispatch(makeAction(LIST_ALL_USERS_FAIL, error));
      // no need to throw err in this particular instance
    });
  };
}

export function editUser(user) {
  return async (dispatch) => {
    try {
      dispatch(makeAction(EDIT_USER_START));
      const userDBInstance = await UsersDB.getInstance();
      await userDBInstance.editUser(user);
      dispatch(makeAction(EDIT_USER_SUCCESS));
    } catch (err) {
      dispatch(makeAction(EDIT_USER_FAIL, err));
    }
  };
}

/**
 * @param {object} user - NOT a username (different from focusGroup), because usernames are not unique
 */
export function focusUser(user) {
  return (dispatch) => {
    dispatch(makeAction(FOCUS_USER, user));
  };
}

export function clearUserFocus() {
  return (dispatch) => {
    dispatch(makeAction(CLEAR_USER_FOCUS));
  };
}

export function clearUsersErr() {
  return (dispatch) => {
    dispatch(makeAction(CLEAR_ERRS_USER));
  };
}
