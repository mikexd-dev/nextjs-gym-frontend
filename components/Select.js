import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

export default function BasicSelect({
  label,
  options,
  value,
  handleChange,
  type,
}) {
  return (
    <Box sx={{ width: 400 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
        >
          {options &&
            options.map(
              (item) =>
                type === "dynamic-selection" && (
                  <MenuItem value={item.id}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        rowGap: "10px",
                      }}
                    >
                      <Typography>Name: {item.name}</Typography>
                      <Typography>Description: {item.description}</Typography>
                      <Typography>Type: {item.type}</Typography>
                      <Typography>Price: ${item.price}</Typography>
                      <Typography>
                        Sessions: {item.sessions} sessions
                      </Typography>
                    </Box>
                  </MenuItem>
                )
            )}

          {options &&
            options.map((item) =>
              type === "dynamic-selection-config" ||
              type === "dynamic-selection-config-dependent" ? (
                <MenuItem value={item}>
                  <Typography>{item}</Typography>
                </MenuItem>
              ) : (
                <MenuItem value={item.value}>{item.label}</MenuItem>
              )
            )}
        </Select>
      </FormControl>
    </Box>
  );
}
