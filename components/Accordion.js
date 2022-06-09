import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import TextField from "./Input";
import Select from "./Select";
import ExerciseSelect from "./ExerciseSelect";

export default function SimpleAccordion({ exercise, options, handleChange }) {
  return (
    <div>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{exercise.display}</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            columnGap: 10,
            alignItems: "center",
          }}
        >
          {exercise?.questions?.map((input, index) => (
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                columnGap: 10,
                alignItems: "center",
                padding: 10,
              }}
            >
              {input.type === "text-input" && (
                <TextField
                  defaultValue={""}
                  label={input.display}
                  value={input.answer}
                  handleChange={(e) => handleChange(e.target.value, index)}
                  isMultiline={true}
                />
              )}
              {input.type === "workout-exercise-selection" && (
                <ExerciseSelect
                  type={input.type}
                  label={input.display}
                  value={input.answer}
                  options={options}
                  handleChange={(value) => {
                    console.log(value, "value");
                    handleChange(value, index);
                  }}
                  isMultiline={true}
                />
              )}
              {input.type === "dynamic-selection-config" && (
                <Select
                  type={input.type}
                  label={input.display}
                  value={input.answer}
                  options={input.value}
                  handleChange={(e) => handleChange(e.target.value, index)}
                  isMultiline={true}
                />
              )}
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
