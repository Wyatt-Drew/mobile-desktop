import { createSlice } from "@reduxjs/toolkit";

const countdownSlice = createSlice({
  name: "countdown",
  initialState: { timeLeft: 10 },
  reducers: {
    setTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },
  },
});

export const { setTimeLeft } = countdownSlice.actions;
export default countdownSlice.reducer;
