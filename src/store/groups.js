import { createSlice } from '@reduxjs/toolkit';

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    error: null,
    group: null,
    groups: []
  },
  reducers: {
    addGroup: state => {
      // @TODO
    },
  },
});

export const { addGroup} = groupsSlice.actions;

export const selectGroup = ({ groupsState }) => {
    console.log('state is', groupsState)
    return groupsState.group
};

export default groupsSlice.reducer;
