import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "", // 'success' hoặc 'error'
  isOpen: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.isOpen = true;
    },
    hideNotification: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
