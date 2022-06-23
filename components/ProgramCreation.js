import React, { useEffect, useState } from "react";
import { AppBar, Grid, Button } from "@material-ui/core";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Add from "@material-ui/icons/Add";
import Close from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "../components/Input";
import Select from "../components/Select";
import DateTime from "../components/DateTime";
import Autocomplete from "../components/Autocomplete";
import { MdClose } from "react-icons/md";
import Workout from "../components/WorkoutStepper";
import ExerciseCreate from "../components/ExercisePopup";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "60px",
    width: "100%",
    backgroundColor: "#fff",
  },
  appBar: {
    color: "inherit",
    backgroundColor: "white",
    color: "#f9a402",
    "& .myTab": {
      backgroundColor: "yellow",
      color: "black",
      flexDirection: "row",
    },
  },
}));

const exercise = {
  key: "exercise_",
  display: "Exercise",
  questions: [
    {
      display: "Exercise Name",
      key: "name",
      config: "name",
      type: "text-input",
    },
    {
      question: "Exercise Type",
      key: "type",
      config: "type",
      options: [
        {
          label: "Workout",
          value: "Workout",
        },
        {
          label: "Warmup",
          value: "Warmup",
        },
      ],
      type: "selection",
    },
    {
      question: "Body Parts",
      key: "bodyParts",
      config: "bodyParts",
      type: "dynamic-selection-create",
    },
    {
      question: "Equipments",
      key: "equipments",
      config: "equipments",
      type: "dynamic-selection-create",
    },
    // {
    //   question: "Add-on Equipments",
    //   key: "addonEquipment",
    //   config: "subEquipmentSettings",
    //   dependent: "equipment",
    //   type: "dynamic-selection-create-dependent",
    // },
    {
      question: "Lower Setup",
      key: "lowerSetup",
      config: "lowerSetup",
      type: "dynamic-selection-create",
    },
    {
      question: "Upper Setup",
      key: "upperSetup",
      config: "upperSetup",
      type: "dynamic-selection-create",
    },
    {
      question: "General Setup",
      key: "generalSetup",
      config: "generalSetup",
      type: "dynamic-selection-create",
    },
    {
      question: "Execution",
      key: "execution",
      config: "executions",
      type: "dynamic-selection-create",
    },
    {
      question: "Implements",
      key: "implements",
      config: "implements",
      type: "dynamic-selection-create",
    },
    {
      question: "Progression",
      key: "progression",
      config: "progressions",
      type: "dynamic-selection-create",
    },
    {
      question: "Caution",
      key: "caution",
      config: "caution",
      type: "dynamic-selection-create",
    },
    {
      key: "numSets",
      display: "Number of Set",
      type: "text-input",
      config: "number",
    },
    {
      key: "numReps",
      display: "Reps",
      type: "text-input-reps",
      config: "number",
    },
    {
      key: "restTimeSecs",
      display: "Rest Time (sec)",
      type: "text-input",
      config: "number",
    },
    {
      key: "tempo",
      display: "Tempo",
      type: "text-input-tempo",
      config: "number",
    },
    {
      key: "tempoNotes",
      display: "TempoNotes",
      type: "text-input",
    },
    {
      key: "estTime",
      display: "Estimated Time",
      type: "text-input-disabled",
    },
    {
      key: "target",
      display: "Target",
      type: "text-input",
    },
    {
      question: "Strength Quality",
      key: "strengthQuality",
      config: "strengthQuality",
      type: "dynamic-selection-create",
    },
    {
      display: "Purpose",
      key: "purpose",
      config: "purpose",
      type: "text-input",
    },
    {
      display: "Method",
      key: "method",
      config: "method",
      type: "text-input",
    },
  ],
};

const CustomTabsHook = ({
  submitResult,
  toggleProgramDrawer,
  config,
  tabColumns,
  updateConfig,
}) => {
  const classes = useStyles();

  const [tabList, setTabList] = useState(tabColumns);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});

  const [tabValue, setTabValue] = useState(1);

  const handleTabChange = (event, value) => {
    // console.log(value, "123");
    setTabValue(value);
  };

  const addTab = () => {
    let id = tabList[tabList.length - 1].id + 1;
    setTabList([
      ...tabList,
      {
        id: id,
        key: "day" + (Number(id) - 1),
        headerName: "Day " + (Number(id) - 1),
        type: "days",
        content: [
          { key: "trainingName", display: "Training Name", type: "text-input" },
          {
            key: "dayOverview",
            display: "Training Overview",
            type: "text-input",
          },
          {
            key: "day",
            display: "Detailed Day training",
            type: "exercise-selection",
            parts: [
              {
                key: "warmup",
                type: "warmup",
                display: "Warmup",
                exercises: [],
              },
              {
                key: "workout_a",
                type: "workout",
                display: "A",
                exercises: [],
              },
            ],
          },
        ],
      },
    ]);

    setTabValue(id);
  };

  const deleteTab = (e) => {
    e.stopPropagation();

    if (tabList.length === 1) {
      return;
    }
    let tabId = parseInt(e.target.id);
    let tabIDIndex = 0;

    let tabs = tabList.filter((value, index) => {
      if (value.id === tabId) {
        tabIDIndex = index;
      }
      return value.id !== tabId;
    });

    let curValue = parseInt(tabValue);
    if (curValue === tabId) {
      if (tabIDIndex === 0) {
        curValue = tabList[tabIDIndex + 1].id;
      } else {
        curValue = tabList[tabIDIndex - 1].id;
      }
    }
    setTabValue(curValue);
    setTabList(tabs);
  };

  const handleChange = (
    value,
    tabIndex,
    qnIndex,
    partIndex,
    exerciseIndex,
    index,
    isTempo
  ) => {
    // console.log(
    //   value,
    //   tabIndex,
    //   qnIndex,
    //   partIndex,
    //   exerciseIndex,
    //   index,
    //   "handle change",
    //   tabList,
    //   isTempo
    // );
    const temp = tabList;
    if (partIndex === undefined) temp[tabIndex].content[qnIndex].answer = value;
    else {
      // console.log("exercise related", partIndex, exerciseIndex);
      if (isTempo) {
        temp[tabIndex].content[qnIndex].parts[partIndex].exercises[
          exerciseIndex
        ].questions[index]["answer" + isTempo] = value;
      } else if (
        !temp[tabIndex].content[qnIndex].parts[partIndex].exercises[
          exerciseIndex
        ]
      ) {
        // console.log(
        //   "add new exercise?",
        //   temp[tabIndex].content[qnIndex].parts[partIndex].exercises[
        //     exerciseIndex
        //   ]
        // );
        temp[tabIndex].content[qnIndex].parts[partIndex].exercises[
          exerciseIndex
        ] = JSON.parse(JSON.stringify(exercise));
      } else {
        // console.log(temp, "exercise");
        temp[tabIndex].content[qnIndex].parts[partIndex].exercises[
          exerciseIndex
        ].questions[index].answer = value;
      }
    }

    // console.log(temp, "after");
    setTabList([...temp]);
  };

  const openDialog = (tabIndex, qnIndex, partIndex, exerciseIndex) => {
    // console.log("open dialog");
    setDialogData({
      title: "Create Exercise",
      description: "Create new exercise etc",
      tabIndex: tabIndex,
      qnIndex: qnIndex,
      partIndex: partIndex,
      exerciseIndex: exerciseIndex,
      okButton: "Create",
      cancelButton: "Cancel",
      exercise: JSON.parse(JSON.stringify(exercise)),
    });
    setDialogOpen(true);
  };

  const handleDialogClose = async (isAction, exerciseData) => {
    if (isAction === true) {
      // console.log(isAction, exerciseData, "action", tabList);
      // 1. create exercise and display
      //   tabList[]
      const data = tabList;
      data.map((tab) => {
        tab.content.map((c) => {
          c.key === "day" &&
            c.parts.map((part) => {
              part.estTime = 0;
              part.exercises.map((exercise) => {
                const maxRep = 0;
                const tempo = 0;
                const restTime = 0;
                const sets = 0;
                exercise.questions.map((qn) => {
                  if (qn.key === "numReps") {
                    maxRep = Number(qn.answer2);
                    qn.answer = `${qn.answer1}-${qn.answer2}`;
                  }
                  if (qn.key === "numSets") {
                    sets = Number(qn.answer);
                  }
                  if (qn.key === "restTimeSecs") {
                    restTime = Number(qn.answer);
                  }
                  if (qn.key === "tempo") {
                    tempo =
                      Number(qn.answer1) +
                      Number(qn.answer2) +
                      Number(qn.answer3) +
                      Number(qn.answer4);
                    qn.answer = `${qn.answer1}-${qn.answer2}-${qn.answer3}-${qn.answer4}`;
                  }
                });
                // console.log(maxRep, tempo, restTime, sets, "action 2");
                exercise.questions[16].answer =
                  (tempo * maxRep + restTime) * sets;
                part.estTime += exercise.questions[16].answer;
                // console.log(exercise.questions[16], "answer action");
              });
              part.estTimeInMin =
                Math.floor(Number(part.estTime) / 60) +
                "m" +
                (Number(part.estTime) % 60) +
                "s";
            });
        });
      });

      setTabList([...data]);
      // console.log(isAction, exerciseData, "action", data);
      // 2. update config
      // console.log(config, "action config");
      await updateConfig(config);
    } else {
      // console.log(isAction, "action");
    }
    setDialogOpen(false);
  };

  const handleRemovePart = (value, index, position) => {
    const data = tabList;
    // console.log(index, position, data, value);
    data[index].content[position].parts.splice(value, 1);
    // data[index].content[position].parts.map()
    setTabList([...data]);
  };

  const handleAddPart = (partIndex, index, position) => {
    let data = tabList;
    let lastPartDisplay =
      data[index].content[position].parts[partIndex].display;
    let lastPartKey = data[index].content[position].parts[partIndex].key;
    // console.log(index, position, data, partIndex, lastPartDisplay);
    let tempPart = {
      key: "workout_a",
      display: "A",
      exercises: [],
    };
    let chars = ["A", "B", "C", "D", "E", "F", "G"];
    const char = chars[chars.indexOf(lastPartDisplay.slice(-1)) + 1];
    // console.log(
    //   lastPartDisplay,
    //   lastPartDisplay.slice(0, -1),
    //   chars.indexOf(lastPartDisplay.slice(0, -1)),
    //   char,
    //   "char"
    // );
    tempPart.key = lastPartKey.slice(0, -1) + char.toLowerCase();
    tempPart.display = lastPartDisplay.slice(0, -1) + char;
    data[index].content[position].parts.push(tempPart);
    setTabList([...data]);
  };

  const handleRemoveExercise = (partIndex, exerciseIndex, index, position) => {
    const data = tabList;
    // console.log(index, position, data, partIndex, exerciseIndex);
    // if (exerciseIndex !== 0) {
    data[index].content[position].parts[partIndex].exercises.splice(
      exerciseIndex,
      1
    );
    let count = 1;
    data[index].content[position].parts[partIndex].exercises.map((item) => {
      // console.log(item.key, count);
      item.key = item.key.slice(0, -1) + count;
      item.display = item.display.slice(0, -1) + count;
      count += 1;
    });
    // console.log(data, "data");
    setTabList([...data]);
    // }
  };

  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        // height: "100%",
        padding: "10px 50px",
      }}
    >
      <Stack
        direction="row"
        spacing={50}
        justifyContent="space-between"
        alignItems="flex-end"
        sx={{ width: "100%", height: "120px" }}
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
        <Button onClick={toggleProgramDrawer(false)}>
          <MdClose size={40} />
        </Button>
      </Stack>
      <ExerciseCreate
        open={isDialogOpen}
        handleClose={handleDialogClose}
        title={dialogData.title}
        description={dialogData.description}
        okButton={dialogData.okButton}
        cancelButton={dialogData.cancelButton}
        tabIndex={dialogData.tabIndex}
        partIndex={dialogData.partIndex}
        qnIndex={dialogData.qnIndex}
        exerciseIndex={dialogData.exerciseIndex}
        exercise={dialogData.exercise}
        handleChange={handleChange}
        config={config}
      />
      <TabContext value={tabValue}>
        <Grid container alignItems="center" justify="center">
          <Grid item xl={11} lg={11} md={11} sm={11} xs={11}>
            <TabList
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabList.map((tab, index) => (
                <Tab
                  key={tab.key.toString()}
                  value={tab.id}
                  label={tab.headerName}
                  icon={index > 1 && <Close id={tab.id} onClick={deleteTab} />}
                  iconPosition="end"
                  className="mytab"
                />
              ))}
            </TabList>
          </Grid>
          <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
            <Button variant="outlined" onClick={addTab}>
              <Add />
            </Button>
          </Grid>
        </Grid>
        {tabList.map((tab, tabIndex) => {
          return (
            <TabPanel value={tab.id}>
              {tab.content.map((input, qnIndex) => {
                return (
                  <>
                    <Stack
                      direction="row"
                      spacing={20}
                      justifyContent="space-between"
                      alignItems="flex-start"
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
                          tyoe={input.type}
                          handleChange={(e) =>
                            handleChange(e.target.value, tabIndex, qnIndex)
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
                            handleChange(e, tabIndex, qnIndex)
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
                            handleChange(e.target.value, tabIndex, qnIndex)
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
                            handleChange(e, tabIndex, qnIndex)
                          }
                        />
                      )}
                      {input.type === "exercise-selection" && (
                        <Workout
                          steps={input}
                          openDialog={openDialog}
                          isDialogOpen={isDialogOpen}
                          tabIndex={tabIndex}
                          qnIndex={qnIndex}
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
                          handleAddExercise={(partIndex, exerciseIndex) =>
                            handleAddExercise(
                              partIndex,
                              exerciseIndex,
                              index,
                              index1
                            )
                          }
                          handleRemoveExercise={(partIndex, exerciseIndex) =>
                            handleRemoveExercise(
                              partIndex,
                              exerciseIndex,
                              tabIndex,
                              qnIndex
                            )
                          }
                          handleAddPart={(partIndex) =>
                            handleAddPart(partIndex, tabIndex, qnIndex)
                          }
                          handleRemovePart={(partIndex) =>
                            handleRemovePart(partIndex, tabIndex, qnIndex)
                          }
                        />
                      )}
                    </Stack>
                  </>
                );
              })}
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => submitResult(tabList)}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Create Program
                </Button>
              </Paper>
            </TabPanel>
          );
        })}

        {/* <TabPanel value={1}>Item One</TabPanel>
        <TabPanel value={2}>Item Two</TabPanel>
        <TabPanel value={3}>Item Three</TabPanel> */}
      </TabContext>
    </Box>
  );
};

export default CustomTabsHook;
