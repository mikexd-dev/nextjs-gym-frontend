import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function MaterialUIPickers({
  label,
  value,
  handleChange,
  type,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        {type === "date-picker" && (
          <DesktopDatePicker
            label={label}
            inputFormat="MM/dd/yyyy"
            value={value}
            onChange={(newValue) => {
              handleChange(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        )}
        {type === "time-select" && (
          <TimePicker
            label={label}
            value={value}
            onChange={(newValue) => {
              handleChange(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        )}
        {type === "date-time-picker" && (
          <DateTimePicker
            label={label}
            value={value}
            onChange={(newValue) => {
              handleChange(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        )}
      </>
    </LocalizationProvider>
  );
}
