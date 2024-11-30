import React, { useEffect, useState } from "react";
import "./App.css";

const TargetDisplay = ({ subjectId, pdfId, target, onTargetFound, onLogPerformance }) => {
  const [startTime, setStartTime] = useState(null); // Track the time when the target is displayed

  useEffect(() => {
    setStartTime(Date.now()); // Record the start time when the component mounts
  }, [target]); // Reset the start time each time a new target is shown

  const handleTargetFound = () => {
    const endTime = Date.now(); // Record the end time
    const taskTime = ((endTime - startTime) / 1000).toFixed(2); // Calculate elapsed time in seconds

    console.log("Target Found:", {
      subjectId,
      pdfId,
      target,
      taskTime,
    });

    // Log performance to the Performance sheet asynchronously
    onLogPerformance({
      subjectId,
      pdfId,
      target,
      taskTime,
      scrollDistance: 0, // Replace with actual scroll distance if tracked
      numberOfTaps: 1, // Replace with actual number of taps if tracked
    });

    onTargetFound(); // Proceed to the next state immediately
  };

  return (
    <div className="App">
      <h1>Find This Target</h1>
      <div className="image-container">
        <img src={`../targets/${target}.png`} alt="Target" className="target-image" />
      </div>
      <button className="action-button" onClick={handleTargetFound}>
        Target Found
      </button>
    </div>
  );
};

export default TargetDisplay;
