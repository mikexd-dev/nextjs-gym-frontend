import * as React from "react";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

export default function SliderSizes({ label, value, handleChange }) {
  return (
    <Box width={400}>
      <Typography id="input-slider" gutterBottom>
        {label}
      </Typography>
      <Slider
        defaultValue={5}
        min={1}
        max={10}
        aria-label="Default"
        valueLabelDisplay="auto"
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
}
