
import UsersDB from '../../assets/database/UsersDB';
import makeAction from '../../lib/actions';

export const ADD_USER_START = 'ADD_USER_START';
export const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS';
export const ADD_USER_FAIL = 'ADD_USER_FAIL';

export const LIST_USERS_START = 'LIST_USERS_START';
export const LIST_USERS_SUCCESS = 'LIST_USERS_SUCCESS';
export const LIST_USERS_FAIL = 'LIST_USERS_FAIL';

export const CLEAR_ERRS_USER = 'CLEAR_ERRS_USER';

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
 * @param {string} groupName - all group names are unique, so we can use to find the users
 */
export function listUsersByGroup(groupName) {
  return (dispatch) => {
    dispatch(makeAction(LIST_USERS_START));

    return UsersDB.getInstance().then((userDBInstance) => {
      return userDBInstance.listUsers(groupName);
    }).then((users) => {
      dispatch(makeAction(LIST_USERS_SUCCESS, users));
    }).catch((err) => {
      dispatch(makeAction(LIST_USERS_FAIL, err));
      // no need to throw err in this particular instance because
      // ui won't do anything explictly if this part fails
    });
  };
}

export function clearUsersErr() {
  return (dispatch) => {
    dispatch(makeAction(CLEAR_ERRS_USER));
  };
}
