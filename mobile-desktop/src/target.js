import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Target</h1>
      </header>
      <div className="content">
        <div className="image-container">
          <img src={`${process.env.PUBLIC_URL}/Target.png`} alt="Target Screen" className="target-image" />
        </div>
      </div>
    </div>
  );
}

export default App;
