import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function Tags({ label, options, handleChange, value }) {
  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="tags-filled"
        options={programType.map((option) => option.title)}
        onChange={(event, value) => handleChange(value)}
        defaultValue={[programType[0].title]}
        freeSolo
        variant="outlined"
        value={value}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={label}
            placeholder="type more..."
          />
        )}
      />
    </Stack>
  );
}

const programType = [
  { title: "Fat Burning" },
  { title: "Muscle Building" },
  { title: "Endurance" },
  { title: "Strength" },
];
