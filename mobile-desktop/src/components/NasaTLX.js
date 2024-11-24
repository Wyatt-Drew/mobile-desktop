import React from "react";

const NasaTLX = ({ onBeginNext }) => (
  <div>
    <h1>Fill Out NASA-TLX</h1>
    <form>
      <label>Rate Mental Demand:</label>
      <input type="range" min="1" max="10" />
      <br />
      <label>Rate Physical Demand:</label>
      <input type="range" min="1" max="10" />
      <br />
      <label>Rate Performance:</label>
      <input type="range" min="1" max="10" />
      <br />
      {/* Add other fields as needed */}
    </form>
    <button onClick={onBeginNext}>Begin Next Task</button>
  </div>
);

export default NasaTLX;
