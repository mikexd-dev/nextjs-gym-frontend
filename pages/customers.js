import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { FiMoreHorizontal } from "react-icons/fi";
import Box from "@mui/material/Box";

import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import { getUserFromCookie } from "../auth/userCookie";
import DataTable from "../components/DataTable";
import DeleteWithPopper from "../components/DeleteWithPopper";
import Drawer from "../components/Drawer";
import Progress from "../components/Progress";
import Snackbar from "../components/Snackbar";
import CustomerDrawer from "../components/CustomerDrawer";
import { url } from "../urlConfig";

const trainerFormDataInitialState = { name: "", expertise: "" };

const Trainers = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isPopperOpen, setPopperOpen] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: "", severity: "" });
  const [customers, setCustomers] = useState([]);
  const [customerFormData, setCustomerFormData] = useState(
    trainerFormDataInitialState
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [jwtToken, setJwtToken] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const fetchCustomers = useCallback(async (token) => {
    const response = await fetch(`${url}/customers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    const data = await response.json();
    const customerData = data?.data;
    customerData.map((item) => {
      // item.name =
      //   item?.consultation[0]?.basicInfo?.firstName +
      //   " " +
      //   item?.consultation[0]?.basicInfo?.lastName;
      // item.email = item?.consultation[0]?.basicInfo?.email;
      // item.phone = item?.consultation[0]?.basicInfo?.phone;
      let totalSessions = 0;
      item.contract.map((contract) => {
        totalSessions += Number(contract.package.sessions);
      });
      item.sessionsLeft = `${
        totalSessions - item.sessions.length
      }/${totalSessions}`;
      item.sessionsRemaining = totalSessions - item.sessions.length;
    });
    console.log(customerData, " consult");

    setCustomers(data.data);
  }, []);

  useEffect(async () => {
    setIsLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchCustomers(token);
    }
    setIsLoading(false);
  }, [fetchCustomers]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setCustomerFormData(trainerFormDataInitialState);
  };

  const handleCustomerFormChange = (property) => (e) => {
    const customerData = { ...customerFormData, [property]: e.target.value };
    setCustomerFormData(customerData);
    console.log(customerData, "customerdata");
    // const isAllFilled = !!customerData.name && !!customerData.expertise;
    setIsSubmitEnabled(true);
  };

  // const createNewTrainer = async (body) => {
  //   const response = await fetch(`${url}/trainers`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${jwtToken}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(body),
  //   });
  //   if (!response.ok) {
  //     const error = await response.json();
  //     openSnackBar(error);
  //     setTrainerFormData(trainerFormDataInitialState);
  //     return;
  //   }
  //   const trainerCreated = await response.json();
  //   openSnackBar(trainerCreated);
  // };

  // const handleAddNewTrainer = async () => {
  //   await createNewTrainer(trainerFormData);
  //   setDrawerOpen(false);
  //   setTrainerFormData(trainerFormDataInitialState);
  //   await fetchTrainers(jwtToken);
  // };

  const closePopper = () => {
    setPopperOpen(false);
  };

  const deactivateCustomer = async () => {
    const response = await fetch(`${url}/customers/${selectedTrainerId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });
    setSelectedTrainerId("");
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
      return;
    }
    const trainerDeleted = await response.json();
    openSnackBar(trainerDeleted);
    closePopper();
    await fetchTrainers(jwtToken);
  };

  const handleDeleteCustomer = (id) => (event) => {
    setSelectedCustomerId(id);
    setAnchorEl(event.currentTarget);
    setPopperOpen(true);
  };

  const editCustomer = async (body) => {
    const response = await fetch(`${url}/customers/${trainerFormData.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
      setTrainerFormData(trainerFormDataInitialState);
      return;
    }
    const trainerUpdated = await response.json();
    openSnackBar(trainerUpdated);
  };

  const handleUpdateCustomer = async () => {
    await editCustomer(trainerFormData);
    setDrawerOpen(false);
    setTrainerFormData(trainerFormDataInitialState);
    await fetchCustomers(jwtToken);
  };

  const handleMoreClick = (id) => () => {
    const selectedCustomer = customers.find((customer) => customer.id === id);
    setCustomerFormData(selectedCustomer);
    // const isAllFilled = !!selectedTrainer.name && !!selectedTrainer.expertise;
    setIsSubmitEnabled(true);
    setDrawerOpen(true);
  };

  const columns = [
    { field: "index", headerName: "Index", width: 70 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "phone", headerName: "Phone", width: 120 },
    { field: "sessionsLeft", headerName: "Sessions left", width: 150 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <Tooltip title="More" placement="top">
            <IconButton aria-label="edit" onClick={handleMoreClick(id)}>
              <FiMoreHorizontal />
            </IconButton>
          </Tooltip>,
          <DeleteWithPopper
            isPopperOpen={isPopperOpen}
            popperAnchorEl={anchorEl}
            popperPlacement="top"
            popperLabel="Confirm Deactivate?"
            onClose={closePopper}
            onConfirm={deactivateCustomer}
            onClick={handleDeleteCustomer(id)}
          />,
        ];
      },
    },
  ];

  const refresh = async () => {
    setLoading(true);
    await fetchCustomers();
    setLoading(false);
  };

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
              Customers
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
            </Box>
          </Stack>
          <CustomerDrawer
            setDrawerOpen={setDrawerOpen}
            isDrawerOpen={isDrawerOpen}
            title={customerFormData.id ? "Customer Profile" : ""}
            formData={customerFormData}
            submitButtonLabel={customerFormData.id ? "Update" : "Submit"}
            isSubmitEnabled={isSubmitEnabled}
            onChange={handleCustomerFormChange}
            onSubmit={handleUpdateCustomer}
            onDrawerClose={handleCloseDrawer}
          />

          <DataTable
            data={customers.map((customer, index) => ({
              ...customer,
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
