import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { MdClose } from "react-icons/md";

import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import { getUserFromCookie } from "../auth/userCookie";

import Drawer from "../components/Drawer";
import DataTable from "../components/DataTable";
import Backdrop from "../components/Backdrop";
import ComboBox from "../components/ComboBox";
import Progress from "../components/Progress";
import Snackbar from "../components/Snackbar";
import Dialog from "../components/Dialog";
import TextField from "../components/Input";
import Select from "../components/Select";
import DateTime from "../components/DateTime";
import Autocomplete from "../components/Autocomplete";
import Workout from "../components/WorkoutStepper";
import { url } from "../urlConfig";

const columns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "programName", headerName: "Name", width: 180 },
  { field: "programSubName", headerName: "Sub Name", width: 90 },
  { field: "equipment", headerName: "Equipment", width: 90 },
  {
    field: "addonEquipment",
    headerName: "AddOn",
    width: 120,
  },
  {
    field: "generalSetup",
    headerName: "General Setup",
    width: 180,
  },
  {
    field: "upperSetup",
    headerName: "Upper Setup",
    width: 150,
  },
  {
    field: "lowerSetup",
    headerName: "Lower Setup",
    width: 70,
  },
  {
    field: "execution",
    headerName: "Execution",
    width: 70,
  },
  {
    field: "progression",
    headerName: "Progression",
    width: 70,
  },
  {
    field: "caution",
    headerName: "Caution",
    width: 70,
  },
  {
    field: "strengthQuality",
    headerName: "strengthQuality",
    width: 70,
  },
];

const daysContent = [
  { key: "trainingName", display: "Training Name", type: "text-input" },
  {
    key: "durationMins",
    display: "Training Duration (min)",
    type: "dynamic-selection-config",
    value: [30, 40, 50, 60, 90, 120],
  },
  {
    key: "dayOverview",
    display: "Training Overview",
    type: "text-input",
  },
  {
    key: "warmup",
    display: "Warmup Exercises",
    type: "warmup-exercise-selection",
  },
  {
    key: "day",
    display: "Detailed Day training",
    type: "exercise-selection",
    parts: [
      {
        key: "workout_a",
        display: "Workout Part A",
        exercises: [
          {
            key: "exercise_1",
            display: "Exercise 1",
            questions: [
              {
                key: "exerciseDetail",
                display: "Exercise Detail",
                type: "workout-exercise-selection",
              },
              {
                key: "numSets",
                display: "Number of Set",
                type: "dynamic-selection-config",
                value: [1, 2, 3, 4, 5, 6],
              },
              {
                key: "numReps",
                display: "Number of Reps Per Set",
                type: "dynamic-selection-config",
                value: [5, 6, 7, 8, 9, 10],
              },
              {
                key: "tempo",
                display: "Tempo",
                type: "text-input",
              },
              {
                key: "restTimeSecs",
                display: "Rest Time (sec)",
                type: "dynamic-selection-config",
                value: [30, 45, 60, 75],
              },
              {
                key: "target",
                display: "Target",
                type: "text-input",
              },
              {
                key: "tempoNotes",
                display: "TempoNotes",
                type: "text-input",
              },
            ],
          },
        ],
      },
    ],
  },
];

const tabColumns = [
  {
    tab: "programInfo",
    headerName: "Programme Info",
    content: [
      { key: "programName", display: "Program Name", type: "text-input" },
      { key: "programSubName", display: "Program SubName", type: "text-input" },
      { key: "dateStarted", display: "StartingDate", type: "date-picker" },
      {
        key: "totalNumberOfWeeks",
        display: "Number of Weeks",
        type: "dynamic-selection-config",
        value: [4, 6, 8, 12, 16, 20, 24],
      },
      {
        key: "programType",
        display: "Program Type",
        type: "tags-input",
      },
      {
        key: "programNature",
        display: "Program Nature",
        type: "tags-input",
      },
      {
        key: "programOverview",
        display: "Program Overview",
        type: "text-input",
      },
    ],
  },
  {
    tab: "day1",
    headerName: "Day 1",
    type: "days",
    content: daysContent,
  },
];

const Programs = () => {
  const { user } = useUser();
  const [isOpen, setOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [newProgram, setNewProgram] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState();
  const router = useRouter();
  const [value, setValue] = useState("programInfo");
  const [days, setDays] = useState(1);
  const [programTabs, setProgramTabs] = useState(tabColumns);
  const [initialState, setInitialState] = useState(tabColumns);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [daysToDelete, setDaysToDelete] = useState(0);

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      setLoading(true);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      // setLoading(false);
    };
  }, []);

  const fetchExercises = useCallback(async (token) => {
    const response = await fetch(`${url}/exercise`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let data = await response.json();
    console.log(data);
    data.data.map((item) => {
      item.label = item.name;
    });
    setExercises(data.data);
  }, []);

  const fetchPrograms = useCallback(async (token) => {
    const response = await fetch(`${url}/program`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let data = await response.json();
    openSnackBar(data);
    setPrograms(data.data);
  }, []);

  const createProgram = async (body) => {
    const response = await fetch(`${url}/program`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      let error = await response.json();
      return error;
    }
    let program = await response.json();
    console.log(program, "program result");
    return program;
  };

  useEffect(async () => {
    setLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchExercises(token);
      await fetchPrograms(token);
    }
    setLoading(false);
  }, [fetchExercises, fetchPrograms]);

  const openSnackBar = (result) => {
    if (result.status && result.status === "success") {
      setSnackbarMessage(result.message);
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage(result.message || result.error?.message);
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    handleDrawer();
  };

  const handleDrawer = () => {
    // userData.map((item) => {
    //   item.questions.map((item2) => {
    //     delete item2.answer;
    //     delete item2.defaultValue;
    //   });
    // });
    console.log(initialState);
    setProgramTabs([...initialState]);
    setOpen(!isOpen);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleExerciseChange = (
    value,
    index,
    position,
    partIndex,
    exerciseIndex,
    qnIndex
  ) => {
    const data = programTabs;
    console.log(
      index,
      position,
      data,
      value,
      partIndex,
      exerciseIndex,
      qnIndex,
      "wow"
    );

    data[index].content[position].parts[partIndex].exercises[
      exerciseIndex
    ].questions[qnIndex].answer = value;
    setProgramTabs([...data]);
  };

  const handleChange = (value, index, position) => {
    const data = programTabs;
    console.log(index, position, data, value);
    // if (stepperData[index]?.questions[position]?.type === "time-select") {
    //   stepperData[index].questions[position].answer = value;
    //   setUserData([...stepperData]);
    // } else if (stepperData[index]?.questions[position]?.type === "toggle") {
    //   stepperData[index].questions[position].answer = value;
    //   setUserData([...stepperData]);
    // } else {
    // if (!otherAnswer) stepperData[index].questions[position].answer = value;
    data[index].content[position].answer = value;
    setProgramTabs([...data]);
  };

  const handleAddExercise = (partIndex, exerciseIndex, index, position) => {
    let data = programTabs;
    console.log(
      index,
      position,
      data,
      partIndex,
      exerciseIndex,
      data[index].content[position].parts[partIndex].exercises.length
    );
    let temp = {
      key: "exercise_1",
      display: "Exercise 1",
      questions: [
        {
          key: "exerciseDetail",
          display: "Exercise Detail",
          type: "workout-exercise-selection",
        },
        {
          key: "numSets",
          display: "Number of Set",
          type: "dynamic-selection-config",
          value: [1, 2, 3, 4, 5, 6],
        },
        {
          key: "numReps",
          display: "Number of Reps Per Set",
          type: "dynamic-selection-config",
          value: [5, 6, 7, 8, 9, 10],
        },
        {
          key: "tempo",
          display: "Tempo",
          type: "text-input",
        },
        {
          key: "restTimeSecs",
          display: "Rest Time (sec)",
          type: "dynamic-selection-config",
          value: [30, 45, 60, 75],
        },
        {
          key: "target",
          display: "Target",
          type: "text-input",
        },
        {
          key: "tempoNotes",
          display: "TempoNotes",
          type: "text-input",
        },
      ],
    };
    let num = exerciseIndex + 2;
    temp.key = temp.key.slice(0, -1) + num;
    temp.display = temp.display.slice(0, -1) + num;
    console.log(data, "old data");
    data[index].content[position].parts[partIndex].exercises.push(temp);
    console.log(data, "new data");
    // data[index].content[position].answer = value;
    setProgramTabs([...data]);
  };

  const handleAddPart = (partIndex, index, position) => {
    let data = programTabs;
    let lastPartDisplay =
      data[index].content[position].parts[partIndex].display;
    let lastPartKey = data[index].content[position].parts[partIndex].key;
    console.log(index, position, data, partIndex, lastPartDisplay);
    let tempPart = {
      key: "workout_a",
      display: "Workout Part A",
      exercises: [
        {
          key: "exercise_1",
          display: "Exercise 1",
          questions: [
            {
              key: "exerciseDetail",
              display: "Exercise Detail",
              type: "workout-exercise-selection",
            },
            {
              key: "numSets",
              display: "Number of Set",
              type: "dynamic-selection-config",
              value: [1, 2, 3, 4, 5, 6],
            },
            {
              key: "numReps",
              display: "Number of Reps Per Set",
              type: "dynamic-selection-config",
              value: [5, 6, 7, 8, 9, 10],
            },
            {
              key: "tempo",
              display: "Tempo",
              type: "text-input",
            },
            {
              key: "restTimeSecs",
              display: "Rest Time (sec)",
              type: "dynamic-selection-config",
              value: [30, 45, 60, 75],
            },
            {
              key: "target",
              display: "Target",
              type: "text-input",
            },
            {
              key: "tempoNotes",
              display: "TempoNotes",
              type: "text-input",
            },
          ],
        },
      ],
    };
    let chars = ["A", "B", "C", "D", "E", "F", "G"];
    const char = chars[chars.indexOf(lastPartDisplay.slice(-1)) + 1];
    console.log(
      lastPartDisplay,
      lastPartDisplay.slice(0, -1),
      chars.indexOf(lastPartDisplay.slice(0, -1)),
      char,
      "char"
    );
    tempPart.key = lastPartKey.slice(0, -1) + char.toLowerCase();
    tempPart.display = lastPartDisplay.slice(0, -1) + char;
    data[index].content[position].parts.push(tempPart);
    setProgramTabs([...data]);
  };

  const handleRemoveExercise = (partIndex, exerciseIndex, index, position) => {
    const data = programTabs;
    console.log(index, position, data, partIndex, exerciseIndex);
    if (exerciseIndex !== 0) {
      delete data[index].content[position].parts[partIndex].exercises[
        exerciseIndex
      ];
      let count = 1;
      data[index].content[position].parts[partIndex].exercises.map((item) => {
        console.log(item.key, count);
        item.key = item.key.slice(0, -1) + count;
        item.display = item.display.slice(0, -1) + count;
        count += 1;
      });
      console.log(data, "data");
      setProgramTabs([...data]);
    }
  };

  const handleRemovePart = (value, index, position) => {
    const data = programTabs;
    console.log(index, position, data, value);
    // data[index].content[position].answer = value;
    // setProgramTabs([...data]);
  };

  const submitResult = async () => {
    console.log(programTabs, "new program");
    let requestBody = {
      days: [],
    };
    programTabs.map((item) => {
      if (item.type === "days") {
        const day = Number(item.headerName.slice(-1)) - 1;
        requestBody.days[day] = {
          day: item.headerName,
        };
        console.log(day, "day");
        item.content.map((question, dayIndex) => {
          console.log(question, "question", requestBody);
          if (question.key === "day") {
            requestBody.days[day].workout = [];
            question.parts.map((part, partIndex) => {
              requestBody.days[day].workout[partIndex] = {
                exercisePart: part.display,
                exercises: [],
              };
              part.exercises.map((exercise, exerciseIndex) => {
                requestBody.days[day].workout[partIndex].exercises[
                  exerciseIndex
                ] = {};
                exercise.questions.map((item) => {
                  console.log(day, item, requestBody);
                  requestBody.days[day].workout[partIndex].exercises[
                    exerciseIndex
                  ][item.key] = item.answer;

                  requestBody.days[day][item.key] = item.answer;
                });
              });
            });
          } else {
            requestBody.days[day][question.key] = question.answer;
          }
        });
      } else {
        item.content.map((question) => {
          requestBody[question.key] = question.answer;
        });
      }
    });
    // setLoading(true);
    // moment.utc(Date.now()).local().format('DD/MM/YYYY HH:MM'))

    console.log(requestBody, "final");
    // const programResult = await createProgram(requestBody);
    // console.log(programResult, "programResult");
    // requestBody.consultationId = consultationResult?.data?.id;
    // // if() // if no lead
    // requestBody.leadsId = selectedLead?.id;
    // if (checkCustomerSignup()) {
    //   const customerResult = await createCustomer(requestBody);
    //   openSnackBar(customerResult);
    // } else {
    //   openSnackBar(consultationResult);
    // }
    // await fetchPrograms(jwtToken);
    // setNewProgram(questions);
    // handleDrawer();
    // setLoading(false);
  };

  const handleTrainingDaysChange = (num) => {
    let length = 0;
    programTabs.map((item) => {
      if (item.type && item.type === "days") {
        length++;
      }
    });
    if (Number(num) < length) {
      setDaysToDelete(length - Number(num));
      console.log("do nothing", length - Number(num));
      openDialog(length - Number(num));
    } else {
      const temp = [...programTabs];
      let count = Number(num);
      let daysCount = 0;
      temp.map((item) => {
        if (item.type && item.type === "days") {
          count -= 1;
          daysCount++;
        }
      });
      console.log(daysCount);
      for (let i = 1; i <= count; i++) {
        let sum = daysCount + i;
        temp.push({
          tab: "day" + sum,
          headerName: "Day " + sum,
          type: "days",
          content: [
            {
              key: "trainingName",
              display: "Training Name",
              type: "text-input",
            },
            {
              key: "durationMins",
              display: "Training Duration (min)",
              type: "dynamic-selection-config",
              value: [30, 40, 50, 60, 90, 120],
            },
            {
              key: "dayOverview",
              display: "Training Overview",
              type: "text-input",
            },
            {
              key: "warmup",
              display: "Warmup Exercises",
              type: "warmup-exercise-selection",
            },
            {
              key: "day",
              display: "Detailed Day training",
              type: "exercise-selection",
              parts: [
                {
                  key: "workout_a",
                  display: "Workout Part A",
                  exercises: [
                    {
                      key: "exercise_1",
                      display: "Exercise 1",
                      questions: [
                        {
                          key: "exerciseDetail",
                          display: "Exercise Detail",
                          type: "workout-exercise-selection",
                        },
                        {
                          key: "numSets",
                          display: "Number of Set",
                          type: "dynamic-selection-config",
                          value: [1, 2, 3, 4, 5, 6],
                        },
                        {
                          key: "numReps",
                          display: "Number of Reps Per Set",
                          type: "dynamic-selection-config",
                          value: [5, 6, 7, 8, 9, 10],
                        },
                        {
                          key: "tempo",
                          display: "Tempo",
                          type: "text-input",
                        },
                        {
                          key: "restTimeSecs",
                          display: "Rest Time (sec)",
                          type: "dynamic-selection-config",
                          value: [30, 45, 60, 75],
                        },
                        {
                          key: "target",
                          display: "Target",
                          type: "text-input",
                        },
                        {
                          key: "tempoNotes",
                          display: "TempoNotes",
                          type: "text-input",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
      }

      setProgramTabs(temp);
    }
  };

  const openDialog = (daysNum) => {
    setDialogData({
      title: "Remove Days",
      description: `Are you sure you want to remove last ${daysNum} days?`,
      okButton: "Delete",
      cancelButton: "Cancel",
      isDialogForm: false,
    });

    setDialogOpen(true);
  };

  const handleDialogClose = async (isAction, daysNum) => {
    console.log(isAction, "isremove", dialogData, "woo", daysNum);
    if (isAction === true) {
      setLoading(true);
      let temp = programTabs;
      for (let i = 0; i < daysToDelete; i++) {
        temp.pop();
      }
      console.log(temp);
      setProgramTabs([...temp]);
      setDaysToDelete(0);
      setLoading(false);
    }
    setDialogOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Snackbar
        handleClose={handleClose}
        message={snackbarMessage}
        open={isSnackbarOpen}
        severity={snackbarSeverity}
      />
      <Dialog
        open={isDialogOpen}
        handleClose={handleDialogClose}
        title={dialogData.title}
        description={dialogData.description}
        okButton={dialogData.okButton}
        cancelButton={dialogData.cancelButton}
        isDialogForm={dialogData.isDialogForm}
        handleSelectChange={dialogData.handleSelectChange}
      />
      <Progress open={loading} />
      {user?.email && (
        <Drawer>
          <Stack
            direction="row"
            spacing={20}
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", paddingBottom: "20px" }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: "bold",
              }}
            >
              Programs
            </Typography>
            <Button variant="contained" onClick={toggleDrawer(true)}>
              New Program
            </Button>
          </Stack>

          <Backdrop toggleDrawer={toggleDrawer} isOpen={isOpen}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <Stack
                direction="row"
                spacing={50}
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  New Program
                </Typography>
                <Button onClick={toggleDrawer(false)}>
                  <MdClose size={40} />
                </Button>
              </Stack>
              <Stack
                direction="column"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: "100%", marginBottom: 3 }}
              >
                <Typography
                  variant="h8"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  Select Number of Training Days
                </Typography>
                <ComboBox
                  label={"Select Days"}
                  options={["1", "2", "3", "4", "5", "6", "7"]}
                  handleChange={handleTrainingDaysChange}
                  sx={{
                    marginTop: "10px",
                  }}
                ></ComboBox>
              </Stack>

              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleTabChange}
                    aria-label="lab API tabs example"
                  >
                    {programTabs.map((item) => {
                      return <Tab label={item.headerName} value={item.tab} />;
                    })}
                  </TabList>
                </Box>
                {programTabs.map((item, index) => {
                  return (
                    <TabPanel value={item.tab}>
                      {item.content.map((input, index1) => {
                        return (
                          <>
                            <Stack
                              direction="row"
                              spacing={20}
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{
                                width: "100%",
                                paddingBottom: "10px",
                                paddingTop: "20px",
                              }}
                            >
                              {input.type === "text-input" && (
                                <TextField
                                  defaultValue={""}
                                  label={input.display}
                                  value={input.answer}
                                  handleChange={(e) =>
                                    handleChange(e.target.value, index, index1)
                                  }
                                  isMultiline={true}
                                />
                              )}
                              {(input.type === "time-select" ||
                                input.type === "date-picker" ||
                                input.type === "date-time-picker") && (
                                <DateTime
                                  label={input.display}
                                  value={input.answer}
                                  type={input.type}
                                  handleChange={(e) =>
                                    handleChange(e, index, index1)
                                  }
                                />
                              )}
                              {input.type === "dynamic-selection-config" && (
                                <Select
                                  type={input.type}
                                  label={input.display}
                                  value={input.answer}
                                  options={input.value}
                                  handleChange={(e) =>
                                    handleChange(e.target.value, index, index1)
                                  }
                                  isMultiline={true}
                                />
                              )}
                              {input.type === "tags-input" && (
                                <Autocomplete
                                  label={input.display}
                                  value={input.answer}
                                  options={input.value}
                                  handleChange={(e) =>
                                    handleChange(e, index, index1)
                                  }
                                />
                              )}
                              {input.type === "exercise-selection" && (
                                <Workout
                                  steps={input}
                                  exercises={exercises}
                                  handleChange={(
                                    value,
                                    partIndex,
                                    exerciseIndex,
                                    qnIndex
                                  ) =>
                                    handleExerciseChange(
                                      value,
                                      index,
                                      index1,
                                      partIndex,
                                      exerciseIndex,
                                      qnIndex
                                    )
                                  }
                                  handleAddExercise={(
                                    partIndex,
                                    exerciseIndex
                                  ) =>
                                    handleAddExercise(
                                      partIndex,
                                      exerciseIndex,
                                      index,
                                      index1
                                    )
                                  }
                                  handleRemoveExercise={(
                                    partIndex,
                                    exerciseIndex
                                  ) =>
                                    handleRemoveExercise(
                                      partIndex,
                                      exerciseIndex,
                                      index,
                                      index1
                                    )
                                  }
                                  handleAddPart={(partIndex) =>
                                    handleAddPart(partIndex, index, index1)
                                  }
                                  handleRemovePart={(partIndex) =>
                                    handleRemovePart(partIndex, index, index1)
                                  }
                                />
                              )}
                            </Stack>
                          </>
                        );
                      })}
                    </TabPanel>
                  );
                })}
              </TabContext>
              <Stack
                direction="column"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: "100%", paddingBottom: 5 }}
              >
                <Button
                  variant="outlined"
                  onClick={submitResult}
                  sx={{ mt: 1, mr: 1 }}
                >
                  submit
                </Button>
              </Stack>
            </Box>
          </Backdrop>
          <DataTable data={programs} columns={columns} />
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Programs);
