import React, { useState } from "react";

const SubjectEntry = ({ onSubmit, error }) => {
  const [id, setId] = useState("");

  return (
    <div>
      <h1>Enter Subject ID</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Subject ID"
      />
      <button onClick={() => onSubmit(id)}>Submit</button>
    </div>
  );
};

export default SubjectEntry;
