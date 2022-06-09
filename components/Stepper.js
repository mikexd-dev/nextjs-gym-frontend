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
import TextField from "../components/Input";
import Select from "../components/Select";
import Slider from "../components/Scale";
import DateTime from "../components/DateTime";
import Toggle from "../components/Toggle";

export default function VerticalLinearStepper({
  steps,
  handleChange,
  submitResult,
  packages,
  config,
  exercise,
}) {
  const [stepLabel, setStepLabel] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [previewBody, setPreviewBody] = React.useState({});

  const handleNext = () => {
    let allAnswered = true;

    console.log(activeStep, steps.length - 2, " next", steps);
    if (activeStep === steps.length - 2) {
      const requestBody = {
        dateCreated: steps.dateCreated,
        dateModified: steps.dateModified,
        leadsId: steps.leadsId,
      };
      steps.map((item) => {
        requestBody[item.key] = {};
        item.questions &&
          item.questions.map((qn) => {
            if (qn.answer2) {
              requestBody[item.key][qn.key] = {
                answer: qn.answer || qn.defaultValue || false,
                answer2: qn.answer2,
              };
            } else {
              requestBody[item.key][qn.key] = qn.answer || qn.defaultValue;
            }
          });
      });
      console.log(activeStep, steps.length - 1, " next done", requestBody);
      setPreviewBody(requestBody);
    }

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
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        key={steps.length}
      >
        {steps.length > 0 &&
          steps.map((step, index) => (
            <Step key={index}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                <StepLabel
                  optional={
                    index === steps.length - 1 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {step.label}
                </StepLabel>
              </StepButton>

              <StepContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    rowGap: 4,
                    paddingTop: 3,
                  }}
                >
                  {step.questions &&
                    step.questions.map((input, index1) => (
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          columnGap: 10,
                          alignItems: "center",
                        }}
                      >
                        {(input.type === "time-select" ||
                          input.type === "date-picker" ||
                          input.type === "date-time-picker") && (
                          <DateTime
                            label={input.question}
                            value={input.answer}
                            type={input.type}
                            handleChange={(e) =>
                              handleChange(e, index, index1, false)
                            }
                          />
                        )}

                        {input.type === "toggle" && (
                          <Toggle
                            label={input.question}
                            checked={input.answer || false}
                            handleChange={(e) =>
                              handleChange(
                                e.target.checked,
                                index,
                                index1,
                                false
                              )
                            }
                          />
                        )}
                        {input.type === "scale" && (
                          <Slider
                            label={input.question}
                            value={input.answer}
                            handleChange={(e) =>
                              handleChange(e.target.value, index, index1, false)
                            }
                          />
                        )}
                        {input.type === "selection" && (
                          <Select
                            type={input.type}
                            label={input.question}
                            value={input.answer}
                            options={input.options}
                            handleChange={(e) =>
                              handleChange(e.target.value, index, index1, false)
                            }
                            isMultiline={true}
                          />
                        )}
                        {input.type === "dynamic-selection" && (
                          <Select
                            type={input.type}
                            label={input.question}
                            value={input.answer}
                            options={packages}
                            handleChange={(e) =>
                              handleChange(e.target.value, index, index1, false)
                            }
                            isMultiline={true}
                          />
                        )}
                        {input.type === "dynamic-selection-config" && (
                          <Select
                            type={input.type}
                            label={input.question}
                            value={input.answer}
                            options={config[input.config]}
                            handleChange={(e) =>
                              handleChange(e.target.value, index, index1, false)
                            }
                            isMultiline={true}
                          />
                        )}

                        {input.type === "dynamic-selection-config-dependent" &&
                          exercise &&
                          exercise[1]?.questions[0]?.answer && (
                            <Select
                              type={input.type}
                              label={input.question}
                              value={input.answer}
                              options={
                                config[input.config][
                                  exercise[1]?.questions[0]?.answer
                                ]
                              }
                              handleChange={(e) =>
                                handleChange(
                                  e.target.value,
                                  index,
                                  index1,
                                  false
                                )
                              }
                              isMultiline={true}
                            />
                          )}
                        {input.type === "text-input" && (
                          <TextField
                            defaultValue={input.defaultValue}
                            label={input.question}
                            value={input.answer}
                            handleChange={(e) =>
                              handleChange(e.target.value, index, index1, false)
                            }
                            isMultiline={true}
                          />
                        )}
                        {input.secondType === "text-input" && (
                          <TextField
                            defaultValue={input.defaultValue}
                            label={"Others"}
                            value={input.answer2}
                            handleChange={(e) =>
                              handleChange(e.target.value, index, index1, true)
                            }
                            isMultiline={true}
                          />
                        )}
                      </Box>
                    ))}
                  {/* {activeStep === steps.length - 1 && (
                    <div>
                      {Object.keys(previewBody).map(
                        (key, i) =>
                          previewBody[key] &&
                          Object.keys(previewBody[key]).map((key2, i) => {
                            return (
                              <TextField
                                label={key}
                                id="filled-hidden-label-small"
                                defaultValue={previewBody[key][key2]}
                                variant="filled"
                                size="small"
                                disabled
                              />
                            );
                          })
                      )}
                    </div>
                  )} */}
                </Box>

                <Box sx={{ mb: 2, paddingTop: 6 }}>
                  {stepLabel && (
                    <Typography sx={{ color: "red" }}>
                      Please fill up all required fields
                    </Typography>
                  )}
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? "Finish" : "Continue"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
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
