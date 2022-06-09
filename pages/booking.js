import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import { getUserFromCookie } from "../auth/userCookie";
import Drawer from "../components/Drawer";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import Calendar from "react-calendar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Snackbar from "../components/Snackbar";
import Progress from "../components/Progress";
import Autocomplete from "../components/Autocomplete";
import { url } from "../urlConfig";

const getBooking = {
  date: "13/06/2022",
  totalAvailableSlots: 5,
  totalSlots: 15,
  levels: [
    {
      level: 1,
      total: 3,
      available: 2,
    },
    {
      level: 2,
      total: 5,
      available: 3,
    },
    {
      level: 3,
      total: 7,
      available: 1,
    },
  ],
  slots: [
    {
      start: "09:00",
      end: "10:00",
      totalAvailableSlots: 1,
      totalSlots: 5,
      customersBooked: [],
    },
    {
      start: "10:00",
      end: "11:00",
      totalAvailableSlots: 2,
      totalSlots: 5,
      customersBooked: [],
    },
    {
      start: "11:00",
      end: "12:00",
      totalAvailableSlots: 2,
      totalSlots: 5,
      customersBooked: [],
    },
  ],
};

const Booking = () => {
  const { user, logout } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [customers, setCustomers] = useState([]);
  const [activeCustomers, setActiveCustomers] = useState([]);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [jwtToken, setJwtToken] = useState();

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
    let data = await response.json();
    openSnackBar(data);
    console.log(data.data, "customers");
    data.data.map((item) => {
      const { firstName, lastName } = item.consultation[0].basicInfo;
      item.label = firstName + " " + lastName;
    });
    setCustomers(data.data);
  }, []);

  useEffect(async () => {
    setLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchCustomers(token);
    }
    setLoading(false);
  }, [fetchCustomers]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

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

  const onDateChange = (date) => {
    console.log(date, "date");
    console.log(date.toISOString());
    console.log(date.toLocaleDateString());
    setDate(date);
  };

  const checkAvailability = async () => {
    console.log(date.toLocaleDateString());
    setLoading(true);
    setTimeout((i) => {
      console.log("fetched");
      setLoading(false);
    }, 2000);
  };

  const handleCustomerChange = (value) => {
    console.log(value);
    setActiveCustomers(value);
  };

  const bookAppointment = (slot) => {
    console.log(slot, activeCustomers, date.toLocaleDateString());
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              rowGap: "10px",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: "bold",
                paddingBottom: 5,
              }}
            >
              Bookings
            </Typography>
            <Stack
              direction="column"
              spacing={1}
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ width: "100%", marginBottom: 3 }}
            >
              <Typography
                variant="h8"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                }}
              >
                {" "}
                Select customer
              </Typography>
              <Autocomplete
                label={"Select Customer(s)"}
                value={activeCustomers}
                options={customers}
                isCustomData={true}
                handleChange={handleCustomerChange}
              />
            </Stack>
            <Stack
              direction="row"
              spacing={5}
              // justifyContent="space-between"
              alignItems="flex-start"
              columnGap={5}
              sx={{ width: "100%", paddingBottom: "20px" }}
            >
              <Calendar onChange={onDateChange} value={date} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  rowGap: "10px",
                }}
              >
                <Button variant="contained" onClick={checkAvailability}>
                  Check Availability
                </Button>
                {getBooking.slots.map((slot) => {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingBottom: 5,
                      }}
                    >
                      <div>
                        Time: {slot.start} - {slot.end}
                      </div>
                      <div>Available Slot: {slot.totalAvailableSlots}</div>
                      <Button
                        variant="outlined"
                        onClick={() => bookAppointment(slot)}
                        sx={{ marginTop: 1 }}
                        disabled={activeCustomers.length === 0}
                      >
                        Book
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            </Stack>
          </Box>

          {/* <div>Email: {user.email}</div>
            <button onClick={() => logout()}>Logout</button> */}
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Booking);
