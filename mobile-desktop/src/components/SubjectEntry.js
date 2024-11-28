import React, { useState } from "react";
import "./App.css";

const SubjectEntry = ({ onSubmit, webSocket, error }) => {
  const [subjectID, setSubjectID] = useState("");

  const handleSubmit = () => {
    if (subjectID) {
      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        console.log("WebSocket is valid. Sending 'subject-id-entered' message.");
        webSocket.send(JSON.stringify({ type: "subject-id-entered", subjectID })); // Notify mobile app
        console.log("Sent 'subject-id-entered' signal with subjectID:", subjectID);
      } else {
        console.error("WebSocket is not open. Unable to send 'subject-id-entered'.");
      }
      onSubmit(subjectID); // Trigger the next state
    } else {
      console.warn("Subject ID is empty. Please provide a valid Subject ID.");
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
