import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import { getUserFromCookie } from "../auth/userCookie";
import Drawer from "../components/Drawer";
import DataTable from "../components/DataTable";
import Progress from "../components/Progress";
import Snackbar from "../components/Snackbar";
import { url } from "../urlConfig";

const columns = [
  { field: "index", headerName: "Index", width: 70 },
  { field: "firstName", headerName: "First Name", width: 120 },
  {
    field: "email",
    headerName: "Email",
    width: 150,
  },
  {
    field: "phone",
    headerName: "Contact No.",
    width: 120,
  },
  {
    field: "contactMethod",
    headerName: "Contact Method",
    width: 150,
  },
  {
    field: "enquireDate",
    headerName: "Enquired On",
    width: 150,
  },
  {
    field: "marketingConsent",
    headerName: "Marketing Consent",
    width: 140,
  },
  {
    field: "isSignup",
    headerName: "Signed Up",
    type: "boolean",
    width: 100,
  },
  {
    field: "goal",
    headerName: "Goal",
    width: 400,
    type: "array",
    renderCell: (data) => {
      return (
        <Chip
          variant="outlined"
          color={"primary"}
          label={data.formattedValue}
        />
      );
    },
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
    leads.data.map((item) => {
      item.enquireDate = format(new Date(item.enquireDate), "dd MMM yyyy");
    });
    setLeads(leads.data);
    openSnackBar(leads);
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const refresh = async () => {
    setLoading(true);
    await fetchLeads();
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
              Leads
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
            data={leads.map((l, index) => ({
              ...l,
              index: index + 1,
            }))}
            columns={columns}
          />
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Leads);
