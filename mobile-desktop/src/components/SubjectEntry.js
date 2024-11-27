import React, { useState } from "react";
import "./App.css";

const SubjectEntry = ({ onSubmit, webSocket, error }) => {
  const [subjectID, setSubjectID] = useState("");

  const handleSubmit = () => {
    if (subjectID) {
      if (webSocket) {
        webSocket.send(JSON.stringify({ type: "subject-id-entered", subjectID })); // Notify mobile app
        console.log("Sent 'subject-id-entered' signal with subjectID:", subjectID);
      }
      onSubmit(subjectID);
    }
  };

  return (
    <div className="App">
      <h1>Enter Subject ID</h1>
      <input
        type="text"
        value={subjectID}
        onChange={(e) => setSubjectID(e.target.value)}
        placeholder="Enter Subject ID"
      />
      <button className="action-button" onClick={handleSubmit}>
        Submit
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SubjectEntry;
