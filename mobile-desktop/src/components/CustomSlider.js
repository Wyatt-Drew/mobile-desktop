import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const CustomSlider = ({
  name,
  value,
  min = 1,
  max = 21,
  question,
  shortName,
  leftLabel,
  rightLabel,
  onChange,
}) => {
  const handleChange = (event, newValue) => {
    onChange(name, newValue);
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {shortName}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {question}
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        aria-labelledby={`${name}-slider`}
        step={1}
        marks
        min={min}
        max={max}
        valueLabelDisplay="auto"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Typography variant="body2">{leftLabel}</Typography>
        <Typography variant="body2">{rightLabel}</Typography>
      </Box>
    </Box>
  );
};

export default CustomSlider;
