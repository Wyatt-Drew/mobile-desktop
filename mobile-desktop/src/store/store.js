import { configureStore } from "@reduxjs/toolkit";
import countdownSlice from "./countdownSlice";

const store = configureStore({
  reducer: {
    countdown: countdownSlice,
  },
});

export default store;
