import { createSlice } from '@reduxjs/toolkit';
import { addItem } from '../storage'

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    error: null,
    group: null,
    groups: []
  },
  reducers: {
    addGroup: (state, { payload }) => {
      state.group = payload
      state.error = null
    },
    addGroupFail: (state, { payload }) => {
      state.error = payload
    },
  },
});

export const { addGroup, addGroupFail } = groupsSlice.actions;

// Thunks
export const addGroupAsync = (groupName, color) => async dispatch => {
  try {
    const group = {
      name: groupName,
      id: Date.now(),
      users: [],
      updatedAt: Date.now(),
      createdAt: Date.now(),
      color
    }
  
    await addItem({ group, resource: 'groups' })
    dispatch(addGroup(group));
  } catch (err) {
    dispatch(addGroupFail(err.toString()))
  }
};

// Selectors
export const selectGroup = ({ groupsState }) => {
  return groupsState.group
};

export default groupsSlice.reducer;
