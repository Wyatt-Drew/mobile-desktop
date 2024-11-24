// BeginScreen.js
import React from 'react';
import './App.css';

function BeginScreen({ onBegin }) {
  return (
    <div className="App">
      <div className="message-container">
        <p>We will now change the PDF you are given. </p>
        <p>When you are ready press begin.</p>
        <button onClick={onBegin} className="begin-button">Begin</button>
      </div>
    </div>
  );
}

export default BeginScreen;
