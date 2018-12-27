import { combineReducers } from 'redux';
import groups from './groups';
import users from './users';

export default combineReducers({
  groups,
  users,
});
