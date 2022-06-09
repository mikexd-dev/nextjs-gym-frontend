import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import { MdDelete } from "react-icons/md";
import SimpleAccordion from "./Accordion";

export default function VerticalLinearStepper({
  steps,
  handleChange,
  handleAddPart,
  handleRemovePart,
  handleAddExercise,
  handleRemoveExercise,
  exercises,
}) {
  const [stepLabel, setStepLabel] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    let allAnswered = true;
    if (allAnswered) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setStepLabel(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        rowGap: "10px",
      }}
    >
      {/* <Typography sx={{ color: "red" }}>{steps.display}</Typography> */}
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        key={steps.parts.length}
      >
        {steps?.parts?.length > 0 &&
          steps?.parts.map((workout, index) => (
            <Step key={index}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                <StepLabel
                  optional={
                    index === steps?.parts?.length - 1 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {workout.display}
                </StepLabel>
              </StepButton>

              <StepContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    rowGap: 4,
                    columnGap: 4,
                    paddingTop: 3,
                    flexWrap: "wrap",
                  }}
                >
                  {workout.exercises.map((item, exerciseIndex) => {
                    return (
                      <>
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            columnGap: 10,
                            alignItems: "center",
                            paddingBottom: 10,
                          }}
                        >
                          <Box
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              columnGap: 10,
                              alignItems: "center",
                              paddingBottom: 10,
                            }}
                          >
                            <Typography>{item.display}</Typography>
                            <IconButton
                              onClick={() =>
                                handleRemoveExercise(index, exerciseIndex)
                              }
                              sx={{ p: 0, color: "red" }}
                            >
                              <MdDelete sx={{ color: "red" }} />
                            </IconButton>
                            {/* <Button
                            onClick={() =>
                              handleRemoveExercise(index, exerciseIndex)
                            }
                          >
                            <MdDelete sx={{ width: 20 }} />
                          </Button> */}
                          </Box>

                          <SimpleAccordion
                            exercise={item}
                            options={exercises}
                            handleChange={(value, qnIndex) =>
                              handleChange(value, index, exerciseIndex, qnIndex)
                            }
                          />
                        </Box>

                        {exerciseIndex === workout.exercises.length - 1 && (
                          <Box sx={{ mb: 2, paddingTop: 6 }}>
                            <div>
                              <Button
                                variant="contained"
                                onClick={() =>
                                  handleAddExercise(index, exerciseIndex)
                                }
                                sx={{ mt: 1, mr: 1 }}
                              >
                                Add{" "}
                                {item.type === "warmup" ? "Warmup" : "Exercise"}
                              </Button>
                            </div>
                          </Box>
                        )}
                      </>
                    );
                  })}
                </Box>
                {index !== 0 && (
                  <Box sx={{ mb: 2, paddingTop: 6 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleAddPart(index);
                          handleNext();
                        }}
                        color="success"
                        sx={{ mt: 1, mr: 1 }}
                      >
                        New Part
                      </Button>
                      <Button
                        disabled={index === 0}
                        color="error"
                        onClick={() => handleRemovePart(index)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Remove {workout.display}
                      </Button>
                    </div>
                  </Box>
                )}

                <Box sx={{ mb: 2, paddingTop: 6 }}>
                  {stepLabel && (
                    <Typography sx={{ color: "red" }}>
                      Please fill up all required fields
                    </Typography>
                  )}
                  <div>
                    {index < steps.parts.length - 1 && (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.parts.length - 1
                          ? "Finish"
                          : "Next Part"}
                      </Button>
                    )}
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      color="warning"
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Previous Part
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={submitResult} sx={{ mt: 1, mr: 1 }}>
            submit
          </Button>
          {/* <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button> */}
        </Paper>
      )}
    </Box>
  );
}
