import React from "react";
import "./App.css";

const NasaTLX = ({ onBeginNext }) => (
  <div className="App">
    <h1>Fill Out NASA-TLX</h1>
    <form className="nasa-tlx-form">
      <label>Rate Mental Demand:</label>
      <input type="range" min="1" max="10" />
      <label>Rate Physical Demand:</label>
      <input type="range" min="1" max="10" />
      <label>Rate Performance:</label>
      <input type="range" min="1" max="10" />
    </form>
    <button className="action-button" onClick={onBeginNext}>
      Begin Next Task
    </button>
  </div>
);

export default NasaTLX;
