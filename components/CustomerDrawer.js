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

import Drawer from "@mui/material/Drawer";
import Progress from "../components/Progress";
import BookingsTable from "../components/BookingTable";

import Backdrop from "./Backdrop";
import BasicInfoForm from "./CustomerBasicInfo";
import AccordionContract from "./AccordionContract";
import AccordionProgram from "./AccordionProgram";
import ProgramCreation from "./ProgramCreation";
import MeasurementCreation from "./MeasurementCreation";
import ContractCreation from "./ContractCreation";
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
  config,
  onCreateProgram,
  tabColumns,
  isCustomerLoading,
  updateConfig,
  onSubmitMeasurement,
  onMeasurementChange,
  measurementData,
  resetMeasurement,
  resetProgram,
  onSubmitContract,
  onContractChange,
  contractData,
  resetContract,
  packages,
}) {
  // console.log(formData, "formdata");
  const [value, setValue] = useState("1");
  const [exercises, setExercises] = useState([]);
  const [programDrawer, setProgramDrawer] = useState(false);
  const [measurementDrawer, setMeasurementDrawer] = useState(false);
  const [contractDrawer, setContractDrawer] = useState(false);

  const bookingColumns = [
    { field: "id", headerName: "Index", width: 70 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "start", headerName: "Start Time", width: 120 },
    { field: "end", headerName: "End Time", width: 150 },
  ];

  const sessionColumns = [
    { field: "id", headerName: "Index", width: 70 },
    { field: "completedDate", headerName: "Completed Date", width: 150 },
    { field: "startTime", headerName: "Start Time", width: 120 },
    { field: "endTime", headerName: "End Time", width: 150 },
    { field: "durationMins", headerName: "Duration", width: 150 },
    { field: "trainerName", headerName: "Trainer", width: 150 },
  ];

  const measurementColumns = [
    { field: "id", headerName: "Index", width: 70 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "bodyFat", headerName: "Body Fat(%)", width: 100 },
    { field: "weight", headerName: "Body Weight(kg)", width: 120 },
    { field: "leanBodyWeight", headerName: "Lean Body Weight(kg)", width: 160 },
    { field: "bodyFatInKg", headerName: "Body Fat(kg)", width: 100 },
    { field: "abdominal", headerName: "Abdominal(mm)", width: 120 },
    { field: "bicep", headerName: "Bicep(mm)", width: 100 },
    { field: "calf", headerName: "Calf(mm)", width: 100 },
    { field: "chest", headerName: "Chest(mm)", width: 100 },
    { field: "lowerback", headerName: "Lower Back(mm)", width: 120 },
    { field: "subscapular", headerName: "Subscapular(mm)", width: 130 },
    { field: "suprailiac", headerName: "Suprailiac(mm)", width: 130 },
    { field: "thigh", headerName: "Thigh(mm)", width: 100 },
    { field: "tricep", headerName: "Tricep(mm)", width: 100 },
  ];

  useEffect(() => {
    // exercises
    formData && formData?.program?.reverse();
    const exerciseData = [];
    formData?.program?.map((prog, progIndex) => {
      exerciseData[progIndex] = [];
      prog.days.map((day, dayIndex) => {
        exerciseData[progIndex][dayIndex] = [];
        let index = 1;
        day.workout.map((workout) => {
          workout.exercises.map((exercise) => {
            exerciseData[progIndex][dayIndex].push({
              id: index,
              part: workout.exercisePart,
              name: exercise.name,
              equipment: exercise.equipments,
              type: exercise.type,
              numReps: exercise.numReps,
              numSets: exercise.numSets,
              tempo: exercise.tempo,
              restTimeSecs: exercise.restTimeSecs,
              notes: exercise.notes,
            });
            index += 1;
          });
        });
      });
    });
    setExercises(exerciseData);
    // console.log(exerciseData, "wolala");
  }, [formData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleProgramDrawer = () => (event) => {
    // console.log("close 2");
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    // console.log("closed?", programDrawer);
    setProgramDrawer(!programDrawer);
    resetProgram();
  };

  const toggleMeasurementDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    // console.log("closed?", measurementDrawer);
    setMeasurementDrawer(!measurementDrawer);
    resetMeasurement();
  };

  const toggleContractDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    // console.log("closed?", measurementDrawer);
    setContractDrawer(!contractDrawer);
    resetContract();
  };

  const onSubmitProgram = async (data) => {
    // console.log("helloooo closed");
    const result = await onCreateProgram(data);
    // console.log(result, "submitted");
    setProgramDrawer(false);
  };

  const submitMeasurement = async (data) => {
    // console.log("helloooo closed");
    const result = await onSubmitMeasurement(data);
    // console.log(result, "submitted");
    setMeasurementDrawer(false);
  };

  const submitContract = async (data) => {
    // console.log("helloooo closed");
    const result = await onSubmitContract(data);
    // console.log(result, "submitted");
    setContractDrawer(false);
  };

  return (
    // <Backdrop toggleDrawer={() => setDrawerOpen} isOpen={isDrawerOpen}>
    <>
      {/* <Progress open={isCustomerLoading} /> */}
      <Drawer
        anchor={"bottom"}
        open={programDrawer}
        onClose={toggleProgramDrawer()}
      >
        <ProgramCreation
          submitResult={onSubmitProgram}
          toggleProgramDrawer={(e) => toggleProgramDrawer(e)}
          config={config}
          tabColumns={tabColumns}
          updateConfig={updateConfig}
        />
      </Drawer>
      <Drawer
        anchor={"bottom"}
        open={measurementDrawer}
        onClose={toggleMeasurementDrawer()}
      >
        <MeasurementCreation
          submitResult={submitMeasurement}
          closeMeasurementDrawer={toggleMeasurementDrawer}
          onChange={onMeasurementChange}
          data={measurementData}
        />
      </Drawer>
      <Drawer
        anchor={"bottom"}
        open={contractDrawer}
        onClose={toggleContractDrawer()}
      >
        <ContractCreation
          submitResult={submitContract}
          closeContractDrawer={toggleContractDrawer}
          onChange={onContractChange}
          data={contractData}
          packages={packages}
        />
      </Drawer>
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
            Customer Profile
          </Typography>
          {/* <Button onClick={onDrawerClose}>
            <MdClose size={40} />
          </Button> */}
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
                <Tab label="Bookings" value="4" />
                <Tab label="Sessions" value="5" />
                <Tab label="Contracts" value="6" />
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
            <TabPanel value="2">
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
                  Measurements
                </Typography>
                <Button variant="contained" onClick={toggleMeasurementDrawer()}>
                  New Measurements
                </Button>
              </Stack>
              <BookingsTable
                bookings={formData.measurement}
                columns={measurementColumns}
              />
            </TabPanel>
            <TabPanel value="3">
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
                <Button variant="contained" onClick={toggleProgramDrawer()}>
                  New Program
                </Button>
              </Stack>
              <AccordionProgram
                programs={formData.program}
                exercises={exercises}
              />
            </TabPanel>
            <TabPanel value="4">
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                }}
              >
                Bookings
              </Typography>
              <BookingsTable
                bookings={formData.bookings}
                columns={bookingColumns}
              />
            </TabPanel>
            <TabPanel value="5">
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                }}
              >
                Sessions
              </Typography>
              <BookingsTable
                bookings={formData.sessions}
                columns={sessionColumns}
              />
            </TabPanel>
            <TabPanel value="6">
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
                  Contracts
                </Typography>
                <Button variant="contained" onClick={toggleContractDrawer()}>
                  New Contract
                </Button>
              </Stack>
              <AccordionContract
                contracts={formData.contract}
                sessionsLeft={formData.sessionsLeft}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </>

    // </Backdrop>
  );
}
