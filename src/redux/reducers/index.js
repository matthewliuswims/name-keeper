import { combineReducers } from 'redux';
import groups from './groups';
import users from './users';
import toasts from './toasts';

export default combineReducers({
  groups,
  users,
  toasts,
});
