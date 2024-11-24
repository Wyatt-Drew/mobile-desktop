import React from "react";

const StartScreen = ({ onBegin }) => (
  <div>
    <h1>Welcome to the Study</h1>
    <button onClick={onBegin}>Begin</button>
  </div>
);

export default StartScreen;
