import { combineReducers } from "redux";
import screenReducer from "./screenReducer";
import countdownReducer from "./countdownReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  screen: screenReducer,
  countdown: countdownReducer,
  user: userReducer,
});

export default rootReducer;
