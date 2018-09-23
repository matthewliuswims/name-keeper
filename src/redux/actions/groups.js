
import GroupsDB from '../../assets/database/GroupsDB';

export const ADD_GROUPS_START = 'ADD_GROUPS_START';
export const ADD_GROUPS_SUCCESS = 'ADD_GROUPS_SUCCESS';
export const ADD_GROUPS_FAIL = 'ADD_GROUPS_FAIL';

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
      });
  };
}
