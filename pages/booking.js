import { isWithinInterval } from "date-fns";
import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import { getUserFromCookie } from "../auth/userCookie";
import Drawer from "../components/Drawer";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Holidays from "date-holidays";
import Calendar from "react-calendar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Snackbar from "../components/Snackbar";
import Progress from "../components/Progress";
import SimpleAccordion from "../components/AccordionBooking";
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
      start: "07:00",
      end: "08:00",
      totalAvailableSlots: 5,
      totalSlots: 5,
      customersBooked: [],
    },
    {
      start: "08:00",
      end: "09:00",
      totalAvailableSlots: 5,
      totalSlots: 5,
      customersBooked: [],
    },
    {
      start: "09:00",
      end: "10:00",
      totalAvailableSlots: 5,
      totalSlots: 5,
      customersBooked: [],
    },
    {
      start: "10:00",
      end: "11:00",
      totalAvailableSlots: 5,
      totalSlots: 5,
      customersBooked: [],
    },
    {
      start: "11:00",
      end: "12:00",
      totalAvailableSlots: 5,
      totalSlots: 5,
      customersBooked: [],
    },
    {
      start: "17:00",
      end: "18:00",
      totalAvailableSlots: 5,
      totalSlots: 5,
      customersBooked: [],
    },
    {
      start: "18:00",
      end: "19:00",
      totalAvailableSlots: 5,
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
  const [booking, setBooking] = useState({});
  const [disabledDate, setDisabledDate] = useState([]);

  useEffect(() => {
    const hd = new Holidays("SG");
    console.log(hd.getHolidays(2022));
    setDisabledDate(hd.getHolidays(2022));
  }, []);

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
    // console.log(data.data, "customers");
    data.data.map((item) => {
      const { firstName, lastName } = item.consultation[0].basicInfo;
      item.label = firstName + " " + lastName;
    });
    setCustomers(data.data);
  }, []);

  useEffect(async () => {
    setLoading(true);
    const token = getUserFromCookie()?.token;
    setJwtToken(token);
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
    // console.log(date, "date");
    // console.log(date.toISOString());
    // console.log(getDateTime());
    setDate(date);
  };

  const getDateTime = () => {
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var yy = date.getFullYear();
    const dateTime = `${yy}/${mm}/${dd}`;
    return dateTime;
  };

  const checkAvailability = async () => {
    // console.log(getDateTime());
    setLoading(true);
    const response = await fetch(`${url}/booking/get`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date: getDateTime() }),
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let data = await response.json();
    openSnackBar(data);
    // console.log(data.data, "booking");
    data.data.totalSlots = 0;
    data?.data?.slots.map((slot) => {
      data.data.totalSlots += Number(slot.totalSlots);
    });
    setBooking(data.data);
    setLoading(false);
  };

  const handleCustomerChange = (value) => {
    // console.log(value);
    setActiveCustomers(value);
  };

  const updateCustomersBooking = async (customer, date, start, end) => {
    // console.log(customer, "selectedCustomer");
    customer.bookings.push({
      date,
      start,
      end,
    });

    const response = await fetch(`${url}/customers/${customer.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookings: customer.bookings,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let data = await response.json();
    return data;
  };

  const bookAppointment = async (slotIndex) => {
    setLoading(true);
    // console.log(slotIndex, activeCustomers, getDateTime());
    const body = booking;
    body.id = getDateTime();
    activeCustomers.map(async (customer) => {
      const { firstName, lastName } = customer.consultation[0]?.basicInfo;
      body.slots[slotIndex].customersBooked.push({
        id: customer.id,
        name: firstName + " " + lastName,
      });
      body.slots[slotIndex].totalAvailableSlots--;
      // console.log(
      //   customer,
      //   body.id,
      //   body.slots[slotIndex].start,
      //   body.slots[slotIndex].end,
      //   "wola"
      // );
      await updateCustomersBooking(
        customer,
        body.id,
        body.slots[slotIndex].start,
        body.slots[slotIndex].end
      );
    });

    const response = await fetch(`${url}/booking`, {
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
    }
    let data = await response.json();

    openSnackBar(data);
    setBooking(data.data);
    setLoading(false);
  };

  const updateBooking = async () => {
    setLoading(true);
    const response = await fetch(`${url}/booking`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let data = await response.json();
    setBooking(data.data);
    setLoading(false);
  };

  const handleChange = (value, slotIndex, qnIndex) => {
    console.log(value, slotIndex, qnIndex);
    const temp = booking;
    const key = temp.slots[slotIndex].questions[qnIndex].key;
    temp.slots[slotIndex][key] = Number(value);
    temp.slots[slotIndex]["totalAvailableSlots"] =
      Number(value) - temp.slots[slotIndex]["customersBooked"].length;
    // console.log(temp);
    setBooking({ ...temp });
  };

  const checkDisabledDate = (activeStartDate, date, view) => {
    let result = false;
    disabledDate.map((holidayDate) => {
      if (
        isWithinInterval(new Date(date), {
          start: new Date(holidayDate.start),
          end: new Date(holidayDate.end),
        })
      )
        result = true;
    });

    if (date.getDay() === 0) result = true;

    return result;
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
                paddingBottom: 2,
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
              <Calendar
                onChange={onDateChange}
                value={date}
                tileDisabled={({ activeStartDate, date, view }) =>
                  checkDisabledDate(activeStartDate, date, view)
                }
              />
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

                {booking.id && (
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      columnGap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      Availability:
                    </Typography>{" "}
                    {booking.totalAvailableSlots}/{booking.totalSlots}
                  </Box>
                )}
                {booking?.slots?.map((slot, slotIndex) => {
                  return (
                    <SimpleAccordion
                      slot={slot}
                      activeCustomers={activeCustomers}
                      handleChange={(value, qnIndex) =>
                        handleChange(value, slotIndex, qnIndex)
                      }
                      bookAppointment={() => bookAppointment(slotIndex)}
                      updateBooking={updateBooking}
                    />
                  );
                })}
              </Box>
            </Stack>
          </Box>
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Booking);
