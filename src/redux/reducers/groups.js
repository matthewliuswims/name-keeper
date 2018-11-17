import * as ActionTypes from '../actions/groups';

const initialState = {
  loading: false,
  error: null,
  groupName: {},
  groups: [],
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
