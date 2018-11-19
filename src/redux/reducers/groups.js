import * as ActionTypes from '../actions/groups';

const initialState = {
  loading: false,
  error: null,
  // newly added group
  groupName: {},
  // all groups in add - populated by LIST_GROUPS_SUCCESS
  groups: [],
  // the group we are currently 'in' for a group or user screens
  focusedGroup: {},
};

const groups = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_GROUP_START:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case ActionTypes.ADD_GROUP_SUCCESS:
      return {
        ...state,
        groupName: action.groupName,
        error: null,
        loading: false,
      };
    case ActionTypes.ADD_GROUP_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case ActionTypes.LIST_GROUPS_START:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case ActionTypes.LIST_GROUPS_SUCCESS:
      return {
        ...state,
        groups: [...action.payload],
        error: null,
        loading: false,
      };
    case ActionTypes.LIST_GROUPS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionTypes.FOCUS_GROUP:
      return {
        ...state,
        focusedGroup: action.payload,
      };
    case ActionTypes.CLEAR_GROUP_FOCUS:
      return {
        ...state,
        focusedGroup: {},
      };
    case ActionTypes.CLEAR_ERRS_GROUP:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default groups;
