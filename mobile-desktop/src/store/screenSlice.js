import { createSlice } from "@reduxjs/toolkit";

const screenSlice = createSlice({
  name: "screen",
  initialState: {
    currentScreen: 1, // Default to QR_CODE
  },
  reducers: {
    setScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
  },
});

export const { setScreen } = screenSlice.actions;

export default screenSlice.reducer;
