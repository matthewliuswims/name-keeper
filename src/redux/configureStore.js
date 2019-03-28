import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const logger = store => next => (action) => {
  const result = next(action);
  return result;
};

const store = createStore(rootReducer, applyMiddleware(thunk, logger));
export default store;
