import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const logger = store => next => (action) => {
  // console.log('dispatching', action);
  const result = next(action);
  // console.log('next state', store.getState());
  return result;
};

const store = createStore(rootReducer, applyMiddleware(thunk, logger));
export default store;
