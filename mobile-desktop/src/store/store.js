import { configureStore } from "@reduxjs/toolkit";
import countdownReducer from "./countdownSlice";
import screenReducer from "./screenSlice";

const store = configureStore({
  reducer: {
    countdown: countdownReducer,
    screen: screenReducer,
  },
});

export default store;
