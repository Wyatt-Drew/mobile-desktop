// Slider.js
import React from "react";
import "./NasaTLX.css"; // Optional custom CSS for styling

const Slider = ({
  name,
  value,
  min = 1,
  max = 21,
  question,
  shortName,
  leftLabel,
  rightLabel,
  onChange,
  showOnlyOddTicks = true,
}) => {
    const renderTicks = () => {
        const ticks = [];
        const step = 100 / (max - min); // Percentage step for each tick
        for (let i = min; i <= max; i++) {
            if (!showOnlyOddTicks || i % 2 !== 0) {
                const position = (i - min) * step; // Calculate position as a percentage
                ticks.push(
                    <span
                        key={i}
                        className="tick"
                        style={{ left: `${position}%`, transform: "translateX(-50%)" }} // Center-align tick with transform
                    >
                        {i}
                    </span>
                );
            }
        }
        return <div className="ticks">{ticks}</div>;
    };
    
      

  return (
    <div className="slider-container">
      <div className="slider-label">
        <strong>{shortName}</strong>
        <p>{question}</p>
      </div>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.name, e.target.value)}
        className="slider"
      />
      {renderTicks()}
      <div className="slider-labels">
        <span className="slider-left">{leftLabel}</span>
        <span className="slider-right">{rightLabel}</span>
      </div>
    </div>
  );
};

export default Slider;
