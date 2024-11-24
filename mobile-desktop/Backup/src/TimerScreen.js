// TimerScreen.js
import React, { useEffect, useState } from 'react';
import './App.css';

function TimerScreen({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

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

export default TimerScreen;
