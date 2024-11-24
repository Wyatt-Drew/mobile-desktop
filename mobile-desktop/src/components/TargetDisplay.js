import React from "react";
import "./App.css";

const TargetDisplay = ({ target, onTargetFound }) => (
  <div className="App">
    <h1>Find This Target</h1>
    <div className="image-container">
      <img src={`/${target}.png`} alt="Target" className="target-image" />
    </div>
    <button className="action-button" onClick={onTargetFound}>
      Target Found
    </button>
  </div>
);

export default TargetDisplay;
