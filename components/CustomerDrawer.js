import { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MdClose } from "react-icons/md";

import Backdrop from "./Backdrop";
import BasicInfoForm from "./CustomerBasicInfo";
import AccordionContract from "./AccordionContract";
import AccordionProgram from "./AccordionProgram";
// import TrainerForm from "./TrainerForm";

export default function TrainerDrawer({
  setDrawerOpen,
  isDrawerOpen,
  title,
  formData,
  submitButtonLabel,
  isSubmitEnabled,
  onChange,
  onSubmit,
  onDrawerClose,
}) {
  console.log(formData);
  const [value, setValue] = useState("1");
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // exercises
    const exerciseData = [];
    formData?.program?.map((prog) => {
      prog.days.map((day, dayIndex) => {
        exerciseData[dayIndex] = [];
        let index = 1;
        day.workout.map((workout) => {
          workout.exercises.map((exercise) => {
            exerciseData[dayIndex].push({
              id: index,
              part: workout.exercisePart,
              name: exercise.exerciseDetail?.name,
              equipment: exercise.exerciseDetail?.equipment,
              type: exercise.exerciseDetail?.type,
              numReps: exercise.numReps,
              numSets: exercise.numSets,
              notes: exercise.notes,
            });
            index += 1;
          });
        });
      });
    });
    setExercises(exerciseData);
  }, [formData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Backdrop toggleDrawer={() => setDrawerOpen} isOpen={isDrawerOpen}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          rowGap: "10px",
        }}
      >
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
            Customer Profile: {formData.name}
          </Typography>
          <Button onClick={onDrawerClose}>
            <MdClose size={40} />
          </Button>
        </Stack>

        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Basic Info" value="1" />
                <Tab label="Measurements" value="2" />
                <Tab label="Programs" value="3" />
                <Tab label="Contracts" value="4" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <BasicInfoForm
                data={formData}
                onChange={onChange}
                onSubmit={onSubmit}
                isSubmitEnabled={isSubmitEnabled}
                buttonLabel={submitButtonLabel}
              />
            </TabPanel>
            <TabPanel value="2">Measurement</TabPanel>
            <TabPanel value="3">
              <AccordionProgram
                programs={formData.program}
                exercises={exercises}
              />
            </TabPanel>
            <TabPanel value="4">
              <AccordionContract
                contracts={formData.contract}
                sessionsLeft={formData.sessionsLeft}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Backdrop>
  );
}
