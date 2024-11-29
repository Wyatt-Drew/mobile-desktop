import React, { useState } from "react";
import "./App.css";

const SubjectEntry = ({ onSubmit }) => {
  const [subjectID, setSubjectID] = useState("");

  const handleSubmit = () => {
    if (subjectID) {
      communicationService.sendMessage({ type: "subject-id", subjectID });
      onSubmit(subjectID);
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
    </div>
  );
};

export default SubjectEntry;
