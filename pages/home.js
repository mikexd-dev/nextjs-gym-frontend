import withAuth from "../auth/withAuth";
import Link from "next/link";
import { useUser } from "../auth/useUser";
import Drawer from "../components/Drawer";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Progress from "../components/Progress";
import { format } from "date-fns";
import Stack from "@mui/material/Stack";
import Snackbar from "../components/Snackbar";
import { url } from "../urlConfig";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

import { getUserFromCookie } from "../auth/userCookie";

const Home = () => {
  const { user, logout } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dayData, setDayData] = useState({});
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

  const getDateTime = () => {
    const date = new Date();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var yy = date.getFullYear();
    const dateTime = `${yy}/${mm}/${dd}`;
    return dateTime;
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

  const fetchChart = useCallback(async (token) => {
    const response = await fetch(`${url}/chart/day`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: getDateTime(),
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let chart = await response.json();
    // leads.data.map((item) => {
    //   item.enquireDate = format(new Date(item.enquireDate), "dd MMM yyyy");
    // });
    setDayData(chart.data);
    openSnackBar(chart);
  }, []);

  useEffect(async () => {
    setLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchChart(token);
    }
    setLoading(false);
  }, [fetchChart]);

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
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%", paddingBottom: "20px", columnGap: 5 }}
          >
            <Card sx={{ width: 250, margin: "0px !important" }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {dayData.leads}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Leads
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <Card sx={{ width: 250, margin: "0px !important" }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {dayData.consultation}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Consultations
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <Card sx={{ width: 250, margin: "0px !important" }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {dayData.customers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Customers
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Stack>
          <Stack
            direction="row"
            spacing={20}
            justifyContent="center"
            alignItems="flex-start"
            sx={{ width: "100%", padding: "20px", columnGap: 5 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingBottom: 5,
              }}
            >
              <Typography gutterBottom variant="h5" component="div">
                Today's Booking
              </Typography>
              {dayData.bookings?.slots?.map((slot) => {
                return (
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      rowGap: 5,
                      alignItems: "flex-start",
                      marginTop: "0px !important",
                      paddingBottom: 5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: slot.totalAvailableSlots > 0 ? "green" : "red",
                      }}
                    >
                      {" "}
                      Time: {slot.start} - {slot.end} [
                      {slot.totalAvailableSlots}/{slot.totalSlots}]
                    </Typography>
                    {slot.customersBooked.length !== 0 && (
                      <Typography sx={{ fontWeight: "bold" }}>
                        {" "}
                        Clients Booked:
                      </Typography>
                    )}
                    {slot.customersBooked.length !== 0 && (
                      <ul>
                        {slot.customersBooked.map((item) => {
                          return (
                            <li style={{ paddingLeft: 10 }}>{item.name}</li>
                          );
                        })}
                      </ul>
                    )}
                  </Box>
                );
              })}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingBottom: 5,
              }}
            >
              <Typography gutterBottom variant="h5" component="div">
                Expiring Contracts
              </Typography>
              {dayData.contracts?.map((slot) => {
                const url = "/customers/" + slot.customerId;
                return (
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      rowGap: 8,
                      alignItems: "flex-start",
                      paddingBottom: 5,
                    }}
                  >
                    <Card sx={{ width: 250 }}>
                      <Link href={url}>
                        <CardActionArea>
                          <CardContent>
                            <Typography
                              sx={{
                                fontWeight: "bold",
                              }}
                            >
                              {" "}
                              Contract ends {slot.formatEndDate}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Link>
                    </Card>
                  </Box>
                );
              })}
            </Box>
          </Stack>
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Home);
