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
const daysContent = [
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
];
const tabColumns = [
  {
    id: 1,
    key: "programInfo",
    headerName: "Programme Info",
    content: [
      { key: "programName", display: "Program Name", type: "text-input" },
      { key: "programSubName", display: "Program SubName", type: "text-input" },
      { key: "dateStarted", display: "StartingDate", type: "date-picker" },
      {
        key: "totalNumberOfWeeks",
        display: "Number of Weeks",
        type: "text-input",
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
    id: 2,
    key: "day1",
    headerName: "Day 1",
    type: "days",
    content: daysContent,
  },
];

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
  const [config, setConfig] = useState({});
  const [tabColumnData, setTabColumnData] = useState(tabColumns);

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
      item = formatContractData(item);
    });
    // console.log(customerData, " consult");

    setCustomers(data.data);
  }, []);

  const formatContractData = (item) => {
    let totalSessions = 0;
    item.contract.map((contract) => {
      totalSessions += Number(contract.package.sessions);
    });
    item.sessionsLeft = `${
      totalSessions - item.sessions.length
    }/${totalSessions}`;
    item.sessionsRemaining = totalSessions - item.sessions.length;
    return item;
  };

  const fetchConfig = useCallback(async (token, query) => {
    const response = await fetch(`${url}/config`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let data = await response.json();
    let result = data.data[0];
    setConfig(result);
  }, []);

  useEffect(async () => {
    setIsLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchCustomers(token);
      await fetchConfig(token);
    }
    setIsLoading(false);
  }, [fetchCustomers, fetchConfig]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

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

  const handleMoreClick = (id) => () => {
    const selectedCustomer = customers.find((customer) => customer.id === id);
    setCustomerFormData(selectedCustomer);
    router.push(`customers/${selectedCustomer.id}`);
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
    setIsLoading(true);
    await fetchCustomers();
    await fetchConfig();
    setIsLoading(false);
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
