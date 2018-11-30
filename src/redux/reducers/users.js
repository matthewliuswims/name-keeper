import * as ActionTypes from '../actions/users';

const initialState = {
  loading: false,
  error: null,
  groupName: {},
  users: [],
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_USER_START:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case ActionTypes.ADD_USER_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
      };
    case ActionTypes.ADD_USER_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionTypes.LIST_USERS_START:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case ActionTypes.LIST_USERS_SUCCESS:
      return {
        ...state,
        users: [...action.payload],
        error: null,
        loading: false,
      };
    case ActionTypes.LIST_USERS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionTypes.CLEAR_ERRS_USER:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default users;
