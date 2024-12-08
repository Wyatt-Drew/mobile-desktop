import React, { useState } from "react";
import "./App.css";
import "./Completion.css"

const CompletionScreen = ({ onSubmitFeedback }) => {
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      onSubmitFeedback(feedback); // Submit the feedback
      setFeedback(""); // Clear the input
      setFeedbackSubmitted(true); // Show submission message
    } else {
      alert("Please enter your feedback before submitting.");
    }
  };

  return (
    <div className="completion-wrapper">
      <div className="completion-container">
        <h1>The Study is Complete</h1>
        <p>Thank you for participating!</p>
        <p>If you have additional feedback we would love to hear it!</p>
        {feedbackSubmitted ? (
          <p className="feedback-confirmation">Feedback submitted. Thank you!</p>
        ) : (
          <div className="feedback-section">
            <textarea
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={handleFeedbackChange}
              className="feedback-input"
            />
            <button onClick={handleFeedbackSubmit} className="submit-button">
              Submit Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletionScreen;
