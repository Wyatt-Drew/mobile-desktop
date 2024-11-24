import React from "react";
import "./App.css";

const StartScreen = ({ onBegin }) => (
  <div className="App">
    <h1>Welcome to the Study</h1>
    <button className="action-button" onClick={onBegin}>
      Begin
    </button>
  </div>
);

export default StartScreen;
