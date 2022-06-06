import * as React from "react";

import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function SwitchesSize({ label, checked, handleChange }) {
  return (
    <Box width={400}>
      <Typography id="input-slider" gutterBottom>
        {label}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>No</Typography>
        <Switch
          defaultChecked={false}
          inputProps={{ "aria-label": "Switch demo" }}
          checked={checked}
          onChange={handleChange}
        />
        <Typography>Yes</Typography>
      </Stack>
    </Box>
  );
}
