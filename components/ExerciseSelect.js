import * as React from "react";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function BasicSelect({
  label,
  options,
  value,
  handleChange,
  type,
}) {
  return (
    <Box sx={{ width: 400 }}>
      <Autocomplete
        disablePortal
        onChange={(event, newValue) => {
          // console.log(newValue, event);
          handleChange(newValue);
        }}
        value={value}
        id="combo-box-demo"
        options={options}
        sx={{ width: 400 }}
        renderInput={(params) => <TextField {...params} label="Exercises" />}
      />
    </Box>
  );
}
