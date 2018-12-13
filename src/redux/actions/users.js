
import UsersDB from '../../assets/database/UsersDB';
import makeAction from '../../lib/actions';

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
 * @param {Array<Object>} usersList
 * @return almost same as the @param, except that the user object in the array will
 * have its groupNames value be an array instead of a JSON string
 */
function turnUsersListGroupNamesIntoArray(usersList) {
  if (!Array.isArray(usersList)) {
    return usersList; // hopefully we'll never get here
  }
  if (!usersList.length) {
    return usersList;
  }

  const newUsers = usersList.map((user) => {
    const userCopy = Object.assign({}, user);
    const groupNamesArray = JSON.parse(userCopy.groupNames);
    userCopy.groupNames = groupNamesArray; // changing groupNamesField
    return userCopy;
  });

  return newUsers;
}

// @TODO: key primaryGroupName though? primary group
// @TODO: get rid of "primaryGroupName": "Asfasfsaf","groupNameThree": null,   "groupNameTwo": null,
export function listAllUsers() {
  return (dispatch) => {
    dispatch(makeAction(LIST_ALL_USERS_START));
    return UsersDB.getInstance().then((usersDBInstance) => {
      return usersDBInstance.listAllUsers();
    }).then((usersList) => {
      console.log('users list is', usersList);
      const newUsersList = turnUsersListGroupNamesIntoArray(usersList);
      console.log('newUsersList list is', newUsersList);
      dispatch(makeAction(LIST_ALL_USERS_SUCCESS, newUsersList));
    }).catch((error) => {
      dispatch(makeAction(LIST_ALL_USERS_FAIL, error));
      // no need to throw err in this particular instance
    });
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
