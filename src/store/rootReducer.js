import { combineReducers } from "@reduxjs/toolkit";

import groups from "./groups";

const rootReducer = combineReducers({
  groupsState: groups,
});

export default rootReducer;
