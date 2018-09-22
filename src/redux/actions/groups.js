
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
    const addGroupDB = dbInstance.addGroup; // TODO: check does this actually work?

    return addGroupDB(groupName)
      .then((successReturn) => {
        console.log('successReturn addGroupDB is', successReturn);
        dispatch(addGroupSuccess(groupName));
      }).catch((err) => {
        console.log('err addGroupDB is', err);
        dispatch(addGroupFail(err));
      });
  };
}
