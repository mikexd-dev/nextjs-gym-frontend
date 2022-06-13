import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
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
import Stepper from "../components/Stepper";
import Progress from "../components/Progress";
import Snackbar from "../components/Snackbar";
import { url } from "../urlConfig";

const columns = [
  // { field: "id", headerName: "ID", width: 200 },
  { field: "index", headerName: "Index", width: 70 },
  { field: "name", headerName: "Name", width: 180 },
  { field: "type", headerName: "Type", width: 100 },
  { field: "bodyParts", headerName: "Body Part", width: 150 },
  { field: "equipment", headerName: "Equipment", width: 150 },
  // {
  //   field: "addonEquipment",
  //   headerName: "AddOn",
  //   width: 120,
  // },
  {
    field: "generalSetup",
    headerName: "General Setup",
    width: 150,
  },
  {
    field: "upperSetup",
    headerName: "Upper Setup",
    width: 150,
  },
  {
    field: "lowerSetup",
    headerName: "Lower Setup",
    width: 150,
  },
  // {
  //   field: "execution",
  //   headerName: "Execution",
  //   width: 70,
  // },
  // {
  //   field: "progression",
  //   headerName: "Progression",
  //   width: 70,
  // },
  // {
  //   field: "caution",
  //   headerName: "Caution",
  //   width: 70,
  // },
  {
    field: "strengthQuality",
    headerName: "Strength Quality",
    width: 150,
  },
];

const questions = [
  {
    key: "BasicInfo",
    label: "Basic Info",
    questions: [
      {
        question: "Exercise Name",
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
        type: "dynamic-selection-config",
      },
    ],
  },
  {
    key: "equipments",
    label: "Equipments",
    questions: [
      {
        question: "Equipments",
        key: "equipment",
        config: "equipmentSettings",
        type: "dynamic-selection-config",
      },
      {
        question: "Add-on Equipments",
        key: "addonEquipment",
        config: "subEquipmentSettings",
        dependent: "equipment",
        type: "dynamic-selection-config-dependent",
      },
    ],
  },
  {
    key: "setup",
    label: "Setups",
    questions: [
      {
        question: "Lower Setup",
        key: "lowerSetup",
        config: "lowerSetup",
        type: "dynamic-selection-config",
      },
      {
        question: "Upper Setup",
        key: "upperSetup",
        config: "upperSetup",
        type: "dynamic-selection-config",
      },
      {
        question: "General Setup",
        key: "generalSetup",
        config: "generalSetup",
        type: "dynamic-selection-config",
      },
    ],
  },
  {
    key: "execution",
    label: "Execution, Progression And Caution",
    questions: [
      {
        question: "Execution",
        key: "execution",
        config: "executions",
        type: "dynamic-selection-config",
      },
      {
        question: "Progression",
        key: "progression",
        config: "progressions",
        type: "dynamic-selection-config",
      },
      {
        question: "Caution",
        key: "caution",
        config: "caution",
        type: "dynamic-selection-config",
      },
    ],
  },
  {
    key: "others",
    label: "Others",
    questions: [
      {
        question: "Strength Quality",
        key: "strengthQuality",
        config: "strengthQuality",
        type: "dynamic-selection-config",
      },
      {
        question: "Purpose",
        key: "purpose",
        config: "purpose",
        type: "text-input",
      },
      {
        question: "Method",
        key: "method",
        config: "method",
        type: "text-input",
      },
    ],
  },
];

const Exercises = () => {
  const { user } = useUser();
  const [isOpen, setOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [config, setConfig] = useState([]);
  const [newExercise, setNewExercise] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState();
  const router = useRouter();

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
    setExercises(data.data);
  }, []);

  const fetchConfig = useCallback(async (token, query) => {
    const response = await fetch(`${url}/config/TlUivwEwlkdkMRwSHKXS`, {
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
    let result = data.data;
    setConfig(result);
  }, []);

  const createExercise = async (body) => {
    const response = await fetch(`${url}/exercise`, {
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
    let consultation = await response.json();
    return consultation;
  };

  useEffect(async () => {
    setLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchExercises(token);
      await fetchConfig(token);
    }
    setLoading(false);
  }, [fetchExercises, fetchConfig]);

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
    questions.map((item) => {
      item.questions.map((item2) => {
        delete item2.answer;
        delete item2.defaultValue;
      });
    });
    setNewExercise([...questions]);
    setOpen(!isOpen);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleChange = (value, index, position, otherAnswer) => {
    const stepperData = questions;
    if (!otherAnswer) stepperData[index].questions[position].answer = value;
    else stepperData[index].questions[position].answer2 = value;
    setNewExercise([...stepperData]);
  };

  const submitResult = async () => {
    let requestBody = {};
    newExercise.map((item) => {
      item.questions.map((question) => {
        requestBody[question.key] = question.answer;
      });
    });
    setLoading(true);
    // moment.utc(Date.now()).local().format('DD/MM/YYYY HH:MM'))
    const exerciseResult = await createExercise(requestBody);
    console.log(exerciseResult, "exercise result");
    await fetchExercises(jwtToken);
    handleDrawer();
    setLoading(false);
  };

  const refresh = async () => {
    setLoading(true);
    await fetchExercises();
    setLoading(false);
  };

  return (
    <div>
      <Snackbar
        handleClose={handleClose}
        message={snackbarMessage}
        open={isSnackbarOpen}
        severity={snackbarSeverity}
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
              Exercises
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                columnGap: 5,
              }}
            >
              <Button variant="outlined" onClick={refresh}>
                Refresh
              </Button>
              <Button variant="contained" onClick={toggleDrawer(true)}>
                New Exercises
              </Button>
            </Box>
          </Stack>

          <Backdrop toggleDrawer={toggleDrawer} isOpen={isOpen}>
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
                  New Exercises
                </Typography>
                <Button onClick={toggleDrawer(false)}>
                  <MdClose size={40} />
                </Button>
              </Stack>
              {/* <Typography
                variant="h8"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                }}
              >
                {" "}
                Select customer from existing leads data
              </Typography> */}

              <Stepper
                steps={questions}
                handleChange={handleChange}
                submitResult={submitResult}
                config={config}
                exercise={newExercise}
              ></Stepper>
            </Box>
          </Backdrop>
          <DataTable
            data={exercises.map((exercise, index) => ({
              ...exercise,
              index: index + 1,
            }))}
            columns={columns}
          />
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Exercises);
