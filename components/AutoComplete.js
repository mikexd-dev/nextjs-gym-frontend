import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function Tags({
  label,
  options,
  handleChange,
  value,
  isCustomData,
}) {
  return (
    <Stack spacing={3} sx={{ width: 400 }}>
      <Autocomplete
        multiple
        id="tags-filled"
        options={
          isCustomData ? options : programType.map((option) => option.title)
        }
        onChange={(event, value) => handleChange(value)}
        // defaultValue={[isCustomData ? null : programType[0].title]}
        freeSolo
        variant="outlined"
        value={value}
        renderTags={(value, getTagProps) =>
          value.map((option, index) =>
            option.label ? (
              <Chip
                variant="outlined"
                label={option.label}
                {...getTagProps({ index })}
              />
            ) : (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            )
          )
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
