import * as ActionTypes from '../actions/toasts';

const initialState = {
  showingToast: false,
  message: '',
  screenName: '',
};

const toasts = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_TOAST:
      return {
        ...state,
        showingToast: true,
        message: action.payload.message,
        screenName: action.payload.screenName,
      };
    case ActionTypes.CLEAR_TOAST:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default toasts;
