import { createSlice } from "@reduxjs/toolkit";
import { addItem } from "../storage";

// @TODO: change to not use localstorage
// @TODO: change to have all the groups load on launch to homescreen

export const groupsSlice = createSlice({
  name: "groups",
  initialState: {
    error: null,
    group: {
      id: null,
      name: "",
      users: [],
      updatedAt: null,
      createdAt: null,
      colorIndex: null,
    },
    groups: [],
  },
  reducers: {
    addGroup: (state, { payload }) => {
      state.group = payload;
      state.error = null;
    },
    addGroupFail: (state, { payload }) => {
      state.error = payload;
    },
  },
});

const { addGroup, addGroupFail } = groupsSlice.actions;

// Thunks
export const addGroupAsync = (groupName) => async (dispatch) => {
  // @TODO: see if we can get the colors from getState - https://redux-toolkit.js.org/api/createAsyncThunk#payloadcreator
  try {
    const group = {
      name: groupName,
      id: Date.now(),
      users: [],
      updatedAt: Date.now(),
      createdAt: Date.now(),
      colorIndex: 0,
    };

    await addItem({ item: group, resource: "groups" });
    dispatch(addGroup(group));
  } catch (err) {
    dispatch(addGroupFail(err.toString()));
  }
};

// Selectors
export const selectGroup = ({ groupsState }) => {
  return groupsState.group;
};

export default groupsSlice.reducer;
