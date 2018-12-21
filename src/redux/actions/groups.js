
import GroupsDB from '../../assets/database/GroupsDB';
import makeAction from '../../lib/actions';

export const ADD_GROUP_START = 'ADD_GROUP_START';
export const ADD_GROUP_SUCCESS = 'ADD_GROUP_SUCCESS';
export const ADD_GROUP_FAIL = 'ADD_GROUP_FAIL';

export const GROUP_VALIDATION_FAIL = 'GROUP_VALIDATION_FAIL';

export const LIST_GROUPS_START = 'LIST_GROUPS_START';
export const LIST_GROUPS_SUCCESS = 'LIST_GROUPS_SUCCESS';
export const LIST_GROUPS_FAIL = 'LIST_GROUPS_FAIL';

export const FOCUS_GROUP = 'FOCUS_GROUP'; // groups.js reducers for details
export const CLEAR_GROUP_FOCUS = 'CLEAR_GROUP_FOCUS';

export const CLEAR_ERRS_GROUP = 'CLEAR_ERRS_GROUP';

/**
 * note: action creator != action. Action creators are exactly that—functions that create actions.
 * @tutorial https://redux.js.org/basics/actions
 * below action creators do NOT use a payload pattern (whereas the function makeAction does )
 * -> this has implications for the reducer
 */
function addGroupStart(groupName) {
  return {
    type: ADD_GROUP_START,
    groupName,
  };
}

// in reducer we do groupName: action.groupName instead of action.payload
function addGroupSuccess(groupName) {
  return {
    type: ADD_GROUP_SUCCESS,
    groupName,
  };
}

function addGroupFail(error) {
  return {
    type: ADD_GROUP_FAIL,
    error,
  };
}

export function addGroup(groupName) {
  return (dispatch) => {
    dispatch(addGroupStart(groupName));

    return GroupsDB.getInstance().then((groupsDBInstance) => {
      return groupsDBInstance.addGroup(groupName);
    }).then(() => {
      dispatch(addGroupSuccess(groupName));
    }).catch((err) => {
      dispatch(addGroupFail(err));
      // no need to throw err in this particular instance because
      // ui won't do anything explictly if this part fails
    });
  };
}

export function listGroups() {
  return async (dispatch) => {
    try {
      dispatch(makeAction(LIST_GROUPS_START));
      const groupDBInstance = await GroupsDB.getInstance();
      const groupsList = await groupDBInstance.listGroups();
      dispatch(makeAction(LIST_GROUPS_SUCCESS, groupsList));
      return groupsList;
    } catch (err) {
      dispatch(makeAction(LIST_GROUPS_FAIL, err));
    }
  };
}

export function groupValidationFail(error) {
  return (dispatch) => {
    dispatch(makeAction(GROUP_VALIDATION_FAIL, error));
  };
}

export function focusGroup(groupName) {
  return (dispatch) => {
    dispatch(makeAction(FOCUS_GROUP, groupName));
  };
}

export function clearGroupsFocus() {
  return (dispatch) => {
    dispatch(makeAction(CLEAR_GROUP_FOCUS));
  };
}

export function clearGroupsErr() {
  return (dispatch) => {
    dispatch(makeAction(CLEAR_ERRS_GROUP));
  };
}
