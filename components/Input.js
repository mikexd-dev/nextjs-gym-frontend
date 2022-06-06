import * as React from "react";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});

function MultilineTextFields({
  label,
  handleChange,
  value,
  isMultiline,
  defaultValue,
}) {
  return (
    <TextField
      id="standard-multiline-flexible"
      label={label}
      multiline={isMultiline}
      maxRows={4}
      value={value}
      onChange={handleChange}
      defaultValue={defaultValue}
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      sx={{
        width: 400,
      }}
    />
  );
}

export default React.memo(MultilineTextFields);
