import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

function ComboBox({ options, label, handleChange, value }) {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      sx={{ width: 400 }}
      value={value}
      onChange={(event, newValue) => handleChange(newValue)}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}

export default React.memo(ComboBox);
