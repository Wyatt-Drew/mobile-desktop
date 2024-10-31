import React from 'react';
import './App.css';

function App() {
  const handleBegin = () => {
    alert("Begin button pressed!"); // Replace with actual functionality as needed
  };

  return (
    <div className="App">
      <div className="message-container">
        <p>We will now change the PDF you are given. </p>
        <p>
           When you are ready press begin.</p>
        <button onClick={handleBegin} className="begin-button">Begin</button>
      </div>
    </div>
  );
}

export default App;
