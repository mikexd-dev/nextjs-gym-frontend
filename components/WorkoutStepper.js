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
import { FcPlus } from "react-icons/fc";
import SimpleAccordion from "./Accordion";

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { GiReloadGunBarrel } from "react-icons/gi";

export default function VerticalLinearStepper({
  steps,
  handleChange,
  handleAddPart,
  handleRemovePart,
  handleAddExercise,
  handleRemoveExercise,
  exercises,
  openDialog,
  isDialogOpen,
  tabIndex,
  qnIndex,
}) {
  // console.log(tabIndex, qnIndex, "render stepper");
  const [stepLabel, setStepLabel] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [estTime, setEstTime] = React.useState(0);

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

  // React.useEffect(() => {
  //   const time = [];
  //   // console.log(steps, "updated");
  //   steps?.parts?.length > 0 &&
  //     steps?.parts.map((workout, partIndex) => {
  //       time[partIndex] = 0;
  //       workout.exercises.map((exercise, exerciseIndex) => {
  //         exercise?.questions?.map((attr) => {
  //           if (attr.key === "estTime") {
  //             time[partIndex] += Number(attr.answer);
  //           }
  //         });
  //       });
  //       time[partIndex] =
  //         Math.floor(Number(time[partIndex]) / 60) +
  //         "m" +
  //         (Number(time[partIndex]) % 60) +
  //         "s";
  //     });
  //   setEstTime(time);
  // }, [steps, handleAddExercise]);

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
          steps?.parts.map((workout, partIndex) => (
            <Step key={partIndex}>
              <StepButton
                color="inherit"
                onClick={handleStep(partIndex)}
                sx={{ justifyContent: "flex-start !important" }}
              >
                <StepLabel
                  optional={
                    partIndex === steps?.parts?.length - 1 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {workout.display + " (~" + workout.estTimeInMin + ")"}
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
                    paddingLeft: 2,
                  }}
                >
                  {workout.exercises.map((exercise, exerciseIndex) => {
                    return (
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          columnGap: 1,
                          alignItems: "flex-start",
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
                          <Typography>
                            {exercise.display +
                              " " +
                              (Number(exerciseIndex) + 1)}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleRemoveExercise(partIndex, exerciseIndex)
                            }
                            sx={{ p: 0, color: "red" }}
                          >
                            <MdDelete sx={{ color: "red" }} />
                          </IconButton>
                        </Box>
                        {exercise?.questions?.map((attr) => {
                          return (
                            <Box
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                columnGap: 10,
                                alignItems: "flex-start",
                                // paddingBottom: 10,
                              }}
                            >
                              <Typography
                                sx={{ fontSize: 12, fontWeight: "bold" }}
                              >
                                {attr.display || attr.question}:
                              </Typography>
                              {/* {attr.type === "text-input-tempo" && (
                                <Typography sx={{ fontSize: 12 }}>
                                  {`${attr.answer1}-${attr.answer2}-${attr.answer3}-${attr.answer4}`}
                                </Typography>
                              )}
                              {attr.type === "text-input-reps" && (
                                <Typography sx={{ fontSize: 12 }}>
                                  {`${attr.answer1}-${attr.answer2}`}
                                </Typography>
                              )} */}
                              <Typography sx={{ fontSize: 12 }}>
                                {attr.key === "estTime"
                                  ? Math.floor(Number(attr.answer) / 60) +
                                    "m" +
                                    (Number(attr.answer) % 60) +
                                    "s"
                                  : attr.answer}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    );
                  })}
                  <Box
                    sx={{
                      // mb: 2,
                      // backgroundColor: "green",
                      display: "flex",
                      justifyContent: "center",
                      // alignItems: "center",
                      height: 370,
                    }}
                  >
                    <Card
                      sx={{ maxWidth: 345, display: "flex" }}
                      onClick={() =>
                        openDialog(
                          tabIndex,
                          qnIndex,
                          partIndex,
                          workout.exercises.length
                        )
                      }
                    >
                      <CardActionArea>
                        <CardContent>
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              gutterBottom
                              variant="h7"
                              component="div"
                              sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: "bold",
                                rowGap: 0.4,
                              }}
                            >
                              <FcPlus size={20} style={{ marginBottom: 4 }} />
                              <p style={{ margin: 0 }}>Create</p>
                              <p style={{ margin: 0 }}> New </p>
                              <p style={{ margin: 0 }}>Exercise</p>
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>

                    {/* <Button
                      variant="contained"
                      onClick={() =>
                        openDialog(
                          tabIndex,
                          qnIndex,
                          partIndex,
                          workout.exercises.length
                        )
                      }
                      color="secondary"
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Add Exercise
                    </Button> */}
                  </Box>
                  {/* {workout.exercises.map((item, exerciseIndex) => {
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
                          </Box>

                          <SimpleAccordion
                            exercise={item}
                            options={exercises}
                            handleChange={(value, qnIndex) =>
                              handleChange(value, index, exerciseIndex, qnIndex)
                            }
                          />
                        </Box>

                       
                      </>
                    ); */}
                  {/* })} */}
                </Box>
                {partIndex !== 0 && (
                  <Box sx={{ mb: 2, paddingTop: 6 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleAddPart(partIndex);
                          handleNext();
                        }}
                        color="success"
                        sx={{ mt: 1, mr: 1 }}
                      >
                        New Part
                      </Button>
                      <Button
                        disabled={partIndex < 2}
                        color="error"
                        onClick={() => handleRemovePart(partIndex)}
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
                    {partIndex < steps.parts.length - 1 && (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {partIndex === steps.parts.length - 1
                          ? "Finish"
                          : "Next Part"}
                      </Button>
                    )}
                    <Button
                      disabled={partIndex === 0}
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
