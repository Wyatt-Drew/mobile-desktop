import React, { useEffect, useState } from "react";
import "./App.css";

function Countdown({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(5); // Example: 5 seconds for testing

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="App">
      <h1>Time to familiarize yourself with the PDF</h1>
      <div className="timer">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
    </div>
  );
}

export default Countdown;
