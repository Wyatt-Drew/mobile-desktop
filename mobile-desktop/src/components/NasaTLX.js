import React, { useState } from 'react';
import CustomSlider from './CustomSlider'; // Ensure the correct path
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        NASA Task Load Index (TLX)
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Figure 8.6</strong>
        <br />
        NASA Task Load Index (TLX) method assesses workload on five 7-point scales. Increments of high, medium, and low estimates for each point result in 21 gradations on the scales.
      </Typography>
      <form onSubmit={handleSubmit}>
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Box>
  );
};

export default NasaTLX;
