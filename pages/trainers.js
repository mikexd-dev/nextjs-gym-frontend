import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { MdEdit } from "react-icons/md";

import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import { getUserFromCookie } from "../auth/userCookie";
import DataTable from "../components/DataTable";
import DeleteWithPopper from "../components/DeleteWithPopper";
import Drawer from "../components/Drawer";
import Progress from "../components/Progress";
import Snackbar from "../components/Snackbar";
import TrainerDrawer from "../components/TrainerDrawer";
import { url } from "../urlConfig";

const trainerFormDataInitialValue = { name: "", expertise: "" };
const API_SUCCESS_STATUS = "success";

const Trainers = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isPopperOpen, setPopperOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: "", severity: "" });
  const [trainers, setTrainers] = useState([]);
  const [trainerFormData, setTrainerFormData] = useState(
    trainerFormDataInitialValue
  );
  const [selectedTrainerId, setSelectedTrainerId] = useState("");
  const [jwtToken, setJwtToken] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const isSubmitEnabled = !!trainerFormData.name && !!trainerFormData.expertise;

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
      result?.status === "success"
        ? {
            message: result.message,
            severity: "success",
          }
        : {
            message: result.message || result.error?.message,
            severity: "error",
          }
    );

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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTrainerFormData(trainerFormDataInitialValue);
  };

  const handleTrainerFormChange = (property) => (e) => {
    const trainerData = { ...trainerFormData, [property]: e.target.value };
    setTrainerFormData(trainerData);
  };

  const createNewTrainer = async (body) => {
    try {
      const response = await fetch(`${url}/trainers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      return result;
    } catch {
      return { message: "Something went wrong" };
    }
  };
  
  const handleAddNewTrainer = async () => {
    const response = await createNewTrainer(trainerFormData);
    openSnackBar(response);
    setTrainerFormData(trainerFormDataInitialValue);
    setDrawerOpen(false);
    if(response?.status === API_SUCCESS_STATUS) {
      await fetchTrainers(jwtToken);
    }
  };

  const closePopper = () => {
    setPopperOpen(false);
  };

  const deleteTrainer = async () => {
    try {
      const response = await fetch(`${url}/trainers/${selectedTrainerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      openSnackBar(result);
      if (response.ok) {
        await fetchTrainers(jwtToken)
      };
    } catch {
      openSnackBar({message: "Something went wrong"});
    }
    setSelectedTrainerId("");
    closePopper();
  };

  const handleDeleteTrainer = (id) => (event) => {
    setSelectedTrainerId(id);
    setAnchorEl(event.currentTarget);
    setPopperOpen(true);
  };

  const updateTrainer = async (body) => {
    try {
      const response = await fetch(`${url}/trainers/${trainerFormData.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      return result;
    } catch {
      return { message: "Something went wrong" };
    }
  };
  
  const handleUpdateTrainer = async () => {
    const response = await updateTrainer(trainerFormData);
    openSnackBar(response);
    setDrawerOpen(false);
    setTrainerFormData(trainerFormDataInitialValue);
    if(response?.status === API_SUCCESS_STATUS) {
      await fetchTrainers(jwtToken);
    }
  };

  const handleEditClick = (id) => () => {
    const selectedTrainer = trainers.find((trainer) => trainer.id === id);
    setTrainerFormData(selectedTrainer);
    setDrawerOpen(true);
  };

  const columns = [
    { field: "index", headerName: "Index", width: 70 },
    { field: "name", headerName: "Name", width: 220 },
    { field: "expertise", headerName: "Expertise", width: 280 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <DeleteWithPopper
            isPopperOpen={isPopperOpen}
            popperAnchorEl={anchorEl}
            popperPlacement="top"
            popperLabel="Confirm delete?"
            onClose={closePopper}
            onConfirm={deleteTrainer}
            onClick={handleDeleteTrainer(id)}
          />,
          <Tooltip title="Edit" placement="top">
            <IconButton aria-label="edit" onClick={handleEditClick(id)}>
              <MdEdit />
            </IconButton>
          </Tooltip>,
        ];
      },
    },
  ];

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
            <Button variant="contained" onClick={() => setDrawerOpen(true)}>
              New Trainer
            </Button>
          </Stack>
          <TrainerDrawer
            setDrawerOpen={setDrawerOpen}
            isDrawerOpen={isDrawerOpen}
            title={trainerFormData.id ? "Update Trainer" : "New Trainer"}
            formData={trainerFormData}
            submitButtonLabel={trainerFormData.id ? "Update" : "Submit"}
            isSubmitEnabled={isSubmitEnabled}
            onChange={handleTrainerFormChange}
            onSubmit={
              trainerFormData.id ? handleUpdateTrainer : handleAddNewTrainer
            }
            onDrawerClose={handleCloseDrawer}
          />
          <DataTable
            data={trainers.map((trainer, index) => ({
              ...trainer,
              index: index + 1,
            }))}
            columns={columns}
          />
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Trainers);
