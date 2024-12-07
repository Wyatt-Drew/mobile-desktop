import { createSlice } from "@reduxjs/toolkit";

const countdownSlice = createSlice({
  name: "countdown",
  initialState: {
    timeLeft: 60, // Initial time for the countdown
    isActive: false, // Whether the countdown is active
  },
  reducers: {
    startCountdown: (state, action) => {
      state.timeLeft = action.payload || 60; // Set initial countdown time, default is 10
      state.isActive = true;
    },
    decrementTime: (state) => {
        if (state.timeLeft > 0) {
          state.timeLeft -= 1;
        }
        if (state.timeLeft === 0) {
          state.isActive = false; // Stop countdown only when timeLeft is 0
        }
      },
    stopCountdown: (state) => {
      state.isActive = false;
    },
    resetCountdown: (state, action) => {
      state.timeLeft = action.payload || 10; // Reset time to a specific value
      state.isActive = false;
    },
  },
});

export const {
  startCountdown,
  decrementTime,
  stopCountdown,
  resetCountdown,
} = countdownSlice.actions;

export default countdownSlice.reducer;
