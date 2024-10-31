import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // Initialize state to hold the countdown timer in seconds
  const [timeLeft, setTimeLeft] = useState(140); // 2 minutes in seconds

  useEffect(() => {
    // Set up an interval that counts down every second
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer); // Clear the timer at 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Convert seconds to minutes and seconds for display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Time to familiarize yourself with the PDF</h1>
        <div className="timer">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </header>
    </div>
  );
}

export default App;
