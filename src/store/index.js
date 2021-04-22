import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import rootReducer from "./rootReducer";

import { getEnvironment } from "../utils/environments";

export default configureStore({
  reducer: rootReducer,
  devTools: true,
  // https://redux-toolkit.js.org/api/getDefaultMiddleware
  // below is if we we wanted to have extra middfelware
  // @TODO: enable this only in dev

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["modal/addModal"],
      },
    }).concat(logger),

  // middleware: (getDefaultMiddleware) => {
  //   return getDefaultMiddleware().concat(logger);
  //   // if (getEnvironment().envName === "DEVELOPMENT") {
  //   //   getDefaultMiddleware().concat(logger);
  //   // }
  // },
  // devTools: process.env.__DEV__, // can check env to see if this is prod or not
});
