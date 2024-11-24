import React, { useState } from "react";
import "./NasaTLX.css"; // Custom CSS for styling the form

const NasaTLX = ({ subjectId, pdf, onSubmit }) => {
  const [responses, setResponses] = useState({
    mentalDemand: 1,
    physicalDemand: 1,
    temporalDemand: 1,
    performance: 1,
    effort: 1,
    frustration: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onSubmit(subjectId, pdf, responses);
      console.log("NASA-TLX form submitted:", responses);
    } catch (error) {
      console.error("Error submitting NASA-TLX form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponses((prevResponses) => ({
      ...prevResponses,
      [name]: value,
    }));
  };

  const renderTicks = (min, max) => {
    const ticks = [];
    for (let i = min; i <= max; i++) {
      ticks.push(<span key={i} className="tick">{i}</span>);
    }
    return <div className="ticks">{ticks}</div>;
  };

  const renderSlider = (name, shortName, question, leftLabel, rightLabel) => (
    <div className="slider-container">
      <div className="slider-label">
        <strong>{shortName}</strong>
        <p>{question}</p>
      </div>
      <input
        type="range"
        name={name}
        min="1"
        max="10"
        value={responses[name]}
        onChange={handleInputChange}
        className="slider"
      />
      {renderTicks(1, 10)}
      <div className="slider-labels">
        <span className="slider-left">{leftLabel}</span>
        <span className="slider-right">{rightLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="nasa-tlx-container">
      <h1>NASA Task Load Index (TLX)</h1>
      <p className="nasa-tlx-description">
        <strong>Figure 8.6</strong><br />
        NASA Task Load Index (TLX) method assesses workload on five 7-point scales.
        Increments of high, medium, and low estimates for each point result in 21
        gradations on the scales.
      </p>
      <form className="nasa-tlx-form" onSubmit={handleSubmit}>
        {renderSlider(
          "physicalDemand",
          "Physical Demand",
          "How physically demanding was the task?",
          "Very Low",
          "Very High"
        )}
        {renderSlider(
          "mentalDemand",
          "Mental Demand",
          "How mentally demanding was the task?",
          "Very Low",
          "Very High"
        )}
        {renderSlider(
          "temporalDemand",
          "Temporal Demand",
          "How hurried or rushed was the pace of the task?",
          "Very Low",
          "Very High"
        )}
        {renderSlider(
          "performance",
          "Performance",
          "How successful were you in accomplishing what you were asked to do?",
          "Perfect",
          "Failure"
        )}
        {renderSlider(
          "effort",
          "Effort",
          "How hard did you have to work to accomplish your level of performance?",
          "Very Low",
          "Very High"
        )}
        {renderSlider(
          "frustration",
          "Frustration",
          "How insecure, discouraged, irritated, stressed, and annoyed were you?",
          "Very Low",
          "Very High"
        )}
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default NasaTLX;
