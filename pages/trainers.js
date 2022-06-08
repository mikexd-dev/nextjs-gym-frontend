import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MdClose } from "react-icons/md";

import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import { getUserFromCookie } from "../auth/userCookie";
import Backdrop from "../components/Backdrop";
import DataTable from "../components/DataTable";
import Drawer from "../components/Drawer";
import Progress from "../components/Progress";
import Snackbar from "../components/Snackbar";
import { url } from "../urlConfig";
import TrainerForm from "../components/TrainerForm";

const newTrainerInitialState = { name: "", expertise: "" }

const columns = [
  { field: "name", headerName: "Name", width: 220 },
  { field: "expertise", headerName: "Expertise", width: 280 }
]

const Trainers = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: "", severity: "" });
  const [trainers, setTrainers] = useState([]);
  const [newTrainer, setNewTrainer] = useState(newTrainerInitialState);
  const [jwtToken, setJwtToken] = useState();

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      setIsLoading(true);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const openSnackBar = (result) => {
    setSnackbar(
      result?.status === "success" ? {
        message: result.message,
        severity: "success" 
      } : {
        message: result.message || result.error?.message,
        severity: "error" 
      }
    )
    
    setSnackbarOpen(true);
  };

  const fetchTrainers = useCallback(async (token) => {
    const response = await fetch(`${url}/trainers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    const data = await response.json();
    setTrainers(data.data);
  }, []);

  useEffect(async () => {
    setIsLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchTrainers(token);
    }
    setIsLoading(false);
  }, [fetchTrainers]);

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(!isDrawerOpen);
  };


  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleTrainerFormChange = (property) => (e) => {
    const newTrainerValue = {...newTrainer, [property]: e.target.value}
    setNewTrainer(newTrainerValue)
    const isAllFilled = !!newTrainerValue.name && !!newTrainerValue.expertise
    setIsSubmitEnabled(isAllFilled);
  }

  const createNewTrainer = async (body) => {
    const response = await fetch(`${url}/trainers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
      setNewTrainer(newTrainerInitialState);
      return;
    }
    const trainerCreated = await response.json();
    openSnackBar(trainerCreated);
    return trainerCreated; 
  }
  
  const handleAddNewTrainer = async () => {
      await createNewTrainer(newTrainer);
      setDrawerOpen(false);
      setNewTrainer(newTrainerInitialState);
      await fetchTrainers(jwtToken);
  }

  return (
    <div>
      <Snackbar
        handleClose={handleCloseSnackbar}
        message={snackbar.message}
        open={isSnackbarOpen}
        severity={snackbar.severity}
      />
      <Progress open={isLoading} />
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
              Trainers
            </Typography>
            <Button variant="contained" onClick={toggleDrawer()}>
              New Trainer
            </Button>
          </Stack>

          <Backdrop toggleDrawer={toggleDrawer} isOpen={isDrawerOpen}>
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
                  New Trainer
                </Typography>
                <Button onClick={toggleDrawer()}>
                  <MdClose size={40} />
                </Button>
              </Stack>

              <TrainerForm
                data={newTrainer}
                onChange={handleTrainerFormChange}
                onSubmit={handleAddNewTrainer}
                isSubmitEnabled={isSubmitEnabled}
              />
            </Box>
          </Backdrop>
          <DataTable data={trainers} columns={columns} />
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Trainers);
