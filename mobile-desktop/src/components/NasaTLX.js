import React, { useState } from 'react';
import CustomSlider from './CustomSlider'; // Ensure the correct path
import Button from '@mui/material/Button';
import './NasaTLX.css'; // Import the updated CSS

const NasaTLX = ({ subjectId, pdf, onSubmit }) => {
  const [responses, setResponses] = useState({
    mentalDemand: 1,
    physicalDemand: 1,
    temporalDemand: 1,
    performance: 1,
    effort: 1,
    frustration: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onSubmit(subjectId, pdf, responses);
      console.log('NASA-TLX form submitted:', responses);
    } catch (error) {
      console.error('Error submitting NASA-TLX form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSliderChange = (name, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [name]: value,
    }));
  };

  return (
    <div className="nasa-tlx-background">
      <div className="nasa-tlx-container">
        <h1>NASA Task Load Index (TLX)</h1>
        <form className="nasa-tlx-form" onSubmit={handleSubmit}>
          <CustomSlider
            name="physicalDemand"
            value={responses.physicalDemand}
            question="How physically demanding was the task?"
            shortName="Physical Demand"
            leftLabel="Very Low"
            rightLabel="Very High"
            onChange={handleSliderChange}
          />
          <CustomSlider
            name="mentalDemand"
            value={responses.mentalDemand}
            question="How mentally demanding was the task?"
            shortName="Mental Demand"
            leftLabel="Very Low"
            rightLabel="Very High"
            onChange={handleSliderChange}
          />
          <CustomSlider
            name="temporalDemand"
            value={responses.temporalDemand}
            question="How hurried or rushed was the pace of the task?"
            shortName="Temporal Demand"
            leftLabel="Very Low"
            rightLabel="Very High"
            onChange={handleSliderChange}
          />
          <CustomSlider
            name="performance"
            value={responses.performance}
            question="How successful were you in accomplishing what you were asked to do?"
            shortName="Performance"
            leftLabel="Perfect"
            rightLabel="Failure"
            onChange={handleSliderChange}
          />
          <CustomSlider
            name="effort"
            value={responses.effort}
            question="How hard did you have to work to accomplish your level of performance?"
            shortName="Effort"
            leftLabel="Very Low"
            rightLabel="Very High"
            onChange={handleSliderChange}
          />
          <CustomSlider
            name="frustration"
            value={responses.frustration}
            question="How insecure, discouraged, irritated, stressed, and annoyed were you?"
            shortName="Frustration"
            leftLabel="Very Low"
            rightLabel="Very High"
            onChange={handleSliderChange}
          />
          <div className="submit-button-container">
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
                backgroundColor: '#4caf50',
                '&:hover': {
                backgroundColor: '#45a049', // Slightly darker green on hover
                },
                color: '#fff',
            }}
            >
            {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NasaTLX;
