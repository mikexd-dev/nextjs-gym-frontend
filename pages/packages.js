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
import Snackbar from "../components/Snackbar";
import DataTable from "../components/DataTable";
import Backdrop from "../components/Backdrop";
import Progress from "../components/Progress";
import { url } from "../urlConfig";

const columns = [
  { field: "index", headerName: "Index", width: 70 },
  { field: "name", headerName: "Name", width: 180 },
  { field: "type", headerName: "Type", width: 90 },
  { field: "price", headerName: "Price", width: 90 },
  {
    field: "sessions",
    headerName: "Sessions",
    width: 120,
  },
  {
    field: "description",
    headerName: "Description",
    width: 180,
  },
];

const Packages = () => {
  const { user, logout } = useUser();
  const [isOpen, setOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [packages, setPackages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedLead, setSelectedLead] = useState({});
  const [onboardData, setOnboardData] = useState([]);
  const [userData, setUserData] = useState([]);
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

  const fetchPackages = useCallback(async (token) => {
    const response = await fetch(`${url}/packages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let packages = await response.json();
    setPackages(packages.data);
  }, []);

  useEffect(async () => {
    setLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchPackages(token);
    }
    setLoading(false);
  }, [fetchPackages]);

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
    userData.map((item) => {
      item.questions.map((item2) => {
        delete item2.answer;
        delete item2.defaultValue;
      });
    });
    setUserData([...userData]);
    setOpen(!isOpen);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <>
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
              Packages
            </Typography>
            <Button variant="contained" onClick={toggleDrawer(true)}>
              New Package
            </Button>
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
                  New Package
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
              {/* <ComboBox label={"Select Lead"} options={leads} handleChange={handleLeadsChange}></ComboBox>
                <Stepper steps={userData} handleChange={handleChange} submitResult={submitResult} packages={packages} leads={leads}></Stepper>

                <div>Email: {user.email}</div>
                <button onClick={() => logout()}>Logout</button> */}
            </Box>
          </Backdrop>
          <DataTable
            data={packages.map((p, index) => ({
              ...p,
              index: index + 1,
            }))}
            columns={columns}
          />
        </Drawer>
      )}
    </>
  );
};

export default withAuth(Packages);
