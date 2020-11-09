import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './rootReducer'

export default configureStore({
  reducer: rootReducer,
  devTools: true
  // https://redux-toolkit.js.org/api/getDefaultMiddleware
  // below is if we we wanted to have extra middfelware
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  // devTools: process.env.__DEV__, // can check env to see if this is prod or not
});
