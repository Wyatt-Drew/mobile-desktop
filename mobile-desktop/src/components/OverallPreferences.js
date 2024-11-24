import React, { useState } from "react";
import CustomSlider from "../components/CustomSlider"; // Adjust the path
import "./OverallPreferences.css"; // Import the updated CSS

const OverallPreferences = ({ subjectId, onSubmit }) => {
  const [responses, setResponses] = useState({
    noLandmarks: { accuracy: 1, speed: 1, preference: 1 },
    iconsNumbersColored: { accuracy: 1, speed: 1, preference: 1 },
    icons: { accuracy: 1, speed: 1, preference: 1 },
    lettersThumbnails: { accuracy: 1, speed: 1, preference: 1 },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSliderChange = (section, field, value) => {
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
      <div className="slider-row">
        <div className="slider-container">
          <CustomSlider
            name={`${sectionKey}-accuracy`}
            value={responses[sectionKey].accuracy}
            question="Accuracy"
            shortName="Accuracy"
            min={1}
            max={10}
            leftLabel="Low"
            rightLabel="High"
            onChange={(name, value) => handleSliderChange(sectionKey, "accuracy", value)}
          />
        </div>
        <div className="slider-container">
          <CustomSlider
            name={`${sectionKey}-speed`}
            value={responses[sectionKey].speed}
            question="Speed"
            shortName="Speed"
            min={1}
            max={10}
            leftLabel="Slow"
            rightLabel="Fast"
            onChange={(name, value) => handleSliderChange(sectionKey, "speed", value)}
          />
        </div>
        <div className="slider-container">
          <CustomSlider
            name={`${sectionKey}-preference`}
            value={responses[sectionKey].preference}
            question="Overall Preference"
            shortName="Preference"
            min={1}
            max={10}
            leftLabel="Low"
            rightLabel="High"
            onChange={(name, value) => handleSliderChange(sectionKey, "preference", value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="preferences-container">
      <h1>Overall Preferences Questionnaire</h1>
      <form onSubmit={handleSubmit}>
        {renderSection("noLandmarks", "No Landmarks")}
        {renderSection("iconsNumbersColored", "Icons, Numbers, Colored")}
        {renderSection("icons", "Icons")}
        {renderSection("lettersThumbnails", "Letters and Thumbnails")}
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default OverallPreferences;
