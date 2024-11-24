import React, { useState } from "react";
import "./App.css";

const SubjectEntry = ({ onSubmit, error }) => {
  const [id, setId] = useState("");

  return (
    <div className="App">
      <h1>Enter Subject ID</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Subject ID"
        className="input-field"
      />
      <button className="action-button" onClick={() => onSubmit(id)}>
        Submit
      </button>
    </div>
  );
};

export default SubjectEntry;
