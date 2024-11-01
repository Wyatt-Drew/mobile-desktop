// App.js
import React, { useState } from 'react';
import BeginScreen from './BeginScreen';
import TargetScreen from './TargetScreen';
import TimerScreen from './TimerScreen';
import BlackScreen from './BlackScreen';

function App() {
  const [screen, setScreen] = useState('begin'); // Initial screen
  const [targetImage, setTargetImage] = useState(null); // Initially no image selected

  // Array of image imports using require
  const imageList = [
    require('./targets/Target.png'),
    require('./targets/Target2.png'),
  ];

  const handleBegin = () => {
    setScreen('timer');
  };

  const handleTimerComplete = () => {
    // Select a random image from the list
    const randomIndex = Math.floor(Math.random() * imageList.length);
    setTargetImage(imageList[randomIndex]);
    setScreen('target');
  };

  const handleBackToBlack = () => {
    setScreen('black');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'begin':
        return <BeginScreen onBegin={handleBegin} />;
      case 'timer':
        return <TimerScreen onComplete={handleTimerComplete} />;
      case 'target':
        return <TargetScreen imageSrc={targetImage} />;
      case 'black':
        return <BlackScreen />;
      default:
        return <BlackScreen />;
    }
  };

  return (
    <div>
      {renderScreen()}
      {screen === 'target' && (
        <button onClick={handleBackToBlack} className="back-button">
          Go to Black Screen
        </button>
      )}
    </div>
  );
}

export default App;
