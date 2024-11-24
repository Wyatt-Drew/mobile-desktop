import React from "react";

const TargetDisplay = ({ target, onTargetFound }) => (
  <div>
    <h1>Find this Target</h1>
    <img src={`/${target}.png`} alt="Target" />
    <button onClick={onTargetFound}>Target Found</button>
  </div>
);

export default TargetDisplay;
