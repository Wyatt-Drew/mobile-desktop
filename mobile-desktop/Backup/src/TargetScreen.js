// TargetScreen.js
import React from 'react';
import './App.css';

function TargetScreen({ imageSrc }) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Target</h1>
      </header>
      <div className="content">
        <div className="image-container">
          <img src={imageSrc} alt="Target Screen" className="target-image" />
        </div>
      </div>
    </div>
  );
}

export default TargetScreen;
