import { combineReducers } from "@reduxjs/toolkit";

import groups from "./groups";
import modal from "./modal";

const rootReducer = combineReducers({
  groupsState: groups,
  modalState: modal, // @TODO: rename to be singular?
});

export default rootReducer;
