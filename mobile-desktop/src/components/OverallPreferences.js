import React, { useState } from "react";
import "./App.css";

const OverallPreferences = ({ subjectId, onSubmit }) => {
  const [responses, setResponses] = useState({
    noLandmarks: { accuracy: 1, speed: 1, preference: 1 },
    iconsNumbersColored: { accuracy: 1, speed: 1, preference: 1 },
    icons: { accuracy: 1, speed: 1, preference: 1 },
    lettersThumbnails: { accuracy: 1, speed: 1, preference: 1 },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (section, field, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [section]: {
        ...prevResponses[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    console.log("Form submitted:", responses);

    // Submit each section to the spreadsheet
    try {
      for (const [section, values] of Object.entries(responses)) {
        await onSubmit(subjectId, section, values);
      }
      console.log("Overall preferences submitted successfully!");
    } catch (error) {
      console.error("Error submitting overall preferences:", error);
    }

    setIsSubmitting(false);
  };

  const renderSection = (sectionKey, label) => (
    <div className="preferences-section">
      <h3>{label}</h3>
      <label>
        Accuracy:
        <input
          type="range"
          min="1"
          max="10"
          value={responses[sectionKey].accuracy}
          onChange={(e) => handleInputChange(sectionKey, "accuracy", e.target.value)}
        />
      </label>
      <label>
        Speed:
        <input
          type="range"
          min="1"
          max="10"
          value={responses[sectionKey].speed}
          onChange={(e) => handleInputChange(sectionKey, "speed", e.target.value)}
        />
      </label>
      <label>
        Overall Preference:
        <input
          type="range"
          min="1"
          max="10"
          value={responses[sectionKey].preference}
          onChange={(e) => handleInputChange(sectionKey, "preference", e.target.value)}
        />
      </label>
    </div>
  );

  return (
    <div className="App">
      <h1>Overall Preferences Questionnaire</h1>
      <form onSubmit={handleSubmit}>
        {renderSection("noLandmarks", "No Landmarks")}
        {renderSection("iconsNumbersColored", "Icons, Numbers, Colored")}
        {renderSection("icons", "Icons")}
        {renderSection("lettersThumbnails", "Letters and Thumbnails")}
        <button type="submit" className="action-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default OverallPreferences;
