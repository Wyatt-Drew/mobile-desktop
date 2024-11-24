import React, { useState } from "react";
import "./App.css";

const NasaTLX = ({ subjectId, pdf, onSubmit }) => {
  const [responses, setResponses] = useState({
    mentalDemand: 1,
    physicalDemand: 1,
    temporalDemand: 1,
    performance: 1,
    effort: 1,
    frustration: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks submission status

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return; // Prevent further submissions

    setIsSubmitting(true); // Disable the button
    console.log("Form submitted:", responses);

    try {
      await onSubmit(subjectId, pdf, responses); // Wait for submission to complete
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponses((prevResponses) => ({
      ...prevResponses,
      [name]: value,
    }));
  };

  return (
    <div className="App">
      <h1>Fill Out NASA-TLX</h1>
      <form className="nasa-tlx-form" onSubmit={handleSubmit}>
        <label>
          Rate Mental Demand:
          <input
            type="range"
            name="mentalDemand"
            min="1"
            max="10"
            value={responses.mentalDemand}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Rate Physical Demand:
          <input
            type="range"
            name="physicalDemand"
            min="1"
            max="10"
            value={responses.physicalDemand}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Rate Temporal Demand:
          <input
            type="range"
            name="temporalDemand"
            min="1"
            max="10"
            value={responses.temporalDemand}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Rate Performance:
          <input
            type="range"
            name="performance"
            min="1"
            max="10"
            value={responses.performance}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Rate Effort:
          <input
            type="range"
            name="effort"
            min="1"
            max="10"
            value={responses.effort}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Rate Frustration:
          <input
            type="range"
            name="frustration"
            min="1"
            max="10"
            value={responses.frustration}
            onChange={handleInputChange}
          />
        </label>
        <button
          type="submit"
          className="action-button"
          disabled={isSubmitting} // Disable button if already submitting
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default NasaTLX;
