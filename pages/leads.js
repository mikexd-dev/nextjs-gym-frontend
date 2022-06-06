import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import { getUserFromCookie } from "../auth/userCookie";
import Drawer from "../components/Drawer";
import DataTable from "../components/DataTable";
import Progress from "../components/Progress";
import Snackbar from "../components/Snackbar";
import { url } from "../urlConfig";

const columns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "firstName", headerName: "First Name", width: 120 },
  { field: "lastName", headerName: "Last Name", width: 120 },
  { field: "enquiredDate", headerName: "Enquired On", width: 140 },
  {
    field: "appointmentDate",
    headerName: "Consultation Date",
    width: 150,
  },
  {
    field: "phone",
    headerName: "Contact No.",
    width: 120,
  },
  {
    field: "goal",
    headerName: "Goal",
    width: 300,
  },
];

const Leads = () => {
  const { user, logout } = useUser();
  const [isOpen, setOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [leads, setLeads] = useState([]);
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

  const fetchLeads = useCallback(async (token) => {
    const response = await fetch(`${url}/leads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let leads = await response.json();
    setLeads(leads.data);
  }, []);

  useEffect(async () => {
    setLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchLeads(token);
    }
    setLoading(false);
  }, [fetchLeads]);

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
              Leads
            </Typography>
          </Stack>
          <DataTable data={leads} columns={columns} />
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Leads);
