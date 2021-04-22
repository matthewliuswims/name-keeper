import { createSlice } from "@reduxjs/toolkit";

export const modalsSlice = createSlice({
  name: "modal",
  initialState: {
    modal: undefined,
  },
  reducers: {
    addModal: (state, { payload }) => {
      state.modal = payload;
    },
    dismissModal: (state) => {
      state.modal = undefined;
    },
  },
});

const { addModal, dismissModal } = modalsSlice.actions;
export { dismissModal };

// Thunk
export const addModalAsync = ({
  props = {},
  type = "warning",
  actionCB = () => {},
  declineCB = () => {},
} = {}) => async (dispatch) => {
  return dispatch(
    addModal({
      props,
      type,
      actionCB: () => {
        actionCB();
        dispatch(dismissModal());
      },
      declineCB: () => {
        declineCB();
        dispatch(dismissModal());
      },
    })
  );
};

// Selectors
export const selectModal = ({ modalsState }) => {
  return modalsState.modal;
};

export default modalsSlice.reducer;
