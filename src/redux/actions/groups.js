
import GroupsDB from '../../assets/database/GroupsDB';
import makeAction from '../../lib/actions';

export const ADD_GROUPS_START = 'ADD_GROUPS_START';
export const ADD_GROUPS_SUCCESS = 'ADD_GROUPS_SUCCESS';
export const ADD_GROUPS_FAIL = 'ADD_GROUPS_FAIL';

export const LIST_GROUPS_START = 'LIST_GROUPS_START';
export const LIST_GROUPS_SUCCESS = 'LIST_GROUPS_SUCCESS';
export const LIST_GROUPS_FAIL = 'LIST_GROUPS_FAIL';

/**
 * below action creators do NOT use a payload pattern (whereas the function makeAction does )
 * -> this has implications for the reducer
 */
function addGroupStart(groupName) {
  return {
    type: ADD_GROUPS_START,
    groupName,
  };
}

function addGroupSuccess(groupName) {
  return {
    type: ADD_GROUPS_SUCCESS,
    groupName,
  };
}

function addGroupFail(error) {
  return {
    type: ADD_GROUPS_FAIL,
    error,
  };
}

export function addGroup(groupName) {
  return (dispatch) => {
    dispatch(addGroupStart(groupName));

    const dbInstance = GroupsDB.getInstance();
    const addGroupDB = dbInstance.addGroup;

    return addGroupDB(groupName)
      .then(() => {
        dispatch(addGroupSuccess(groupName));
      }).catch((err) => {
        dispatch(addGroupFail(err));
        throw err; // so UI can deal with the error
      });
  };
}

export function listGroups() {
  return (dispatch) => {
    dispatch(makeAction(LIST_GROUPS_START));
    const dbInstance = GroupsDB.getInstance();
    const listGroupsDB = dbInstance.listGroups;
    return listGroupsDB()
      .then((groupsList) => {
        dispatch(makeAction(LIST_GROUPS_SUCCESS, groupsList));
      }).catch((error) => {
        dispatch(makeAction(LIST_GROUPS_FAIL, error));
        throw error;
      });
  };
}
