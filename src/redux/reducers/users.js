import * as ActionTypes from '../actions/users';

const initialState = {
  loading: false,
  error: null,
  // ALL our users for all groups
  users: [],
  // the user we are currently 'looking at'
  focusedUser: null,
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
    case ActionTypes.LIST_ALL_USERS_START:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case ActionTypes.LIST_ALL_USERS_SUCCESS:
      return {
        ...state,
        users: [...action.payload],
        error: null,
        loading: false,
      };
    case ActionTypes.LIST_ALL_USERS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionTypes.DELETE_USER_START:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case ActionTypes.DELETE_USER_SUCCESS:
      return {
        ...state, // LIST_ALL_USERS needs to be called after to update users
        focusedUser: null,
        error: null,
        loading: false,
      };
    case ActionTypes.DELETE_USER_FAIL:
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
    case ActionTypes.FOCUS_USER:
      return {
        ...state,
        focusedUser: action.payload,
      };
    case ActionTypes.CLEAR_USER_FOCUS:
      return {
        ...state,
        focusedUser: null,
      };
    default:
      return state;
  }
};

export default users;
