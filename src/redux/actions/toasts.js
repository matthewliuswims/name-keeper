import { makeAction } from '../../lib/actions';

export const ADD_TOAST = 'ADD_TOAST';
export const CLEAR_TOAST = 'CLEAR_TOAST';

export function addToast(message, screenName) {
  return (dispatch) => {
    dispatch(makeAction(ADD_TOAST, { message, screenName }));
  };
}

export function clearToast() {
  return (dispatch) => {
    dispatch(makeAction(CLEAR_TOAST));
  };
}
