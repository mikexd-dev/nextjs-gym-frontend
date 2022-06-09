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
import DataTable from "../components/DataTable";
import Backdrop from "../components/Backdrop";
import Stepper from "../components/Stepper";
import ComboBox from "../components/ComboBox";
import Progress from "../components/Progress";
import Snackbar from "../components/Snackbar";
import { url } from "../urlConfig";

const columns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "dateCreated", headerName: "Date", width: 180 },
  { field: "firstName", headerName: "First name", width: 90 },
  { field: "lastName", headerName: "Last name", width: 90 },
  {
    field: "phone",
    headerName: "Phone",
    width: 120,
  },
  {
    field: "email",
    headerName: "Email",
    width: 180,
  },
  {
    field: "isRecurring",
    headerName: "Type",
    width: 150,
  },
  {
    field: "isSignup",
    type: "boolean",
    headerName: "SignUp",
    width: 70,
  },
  // {
  //   field: "typeOfPackage",
  //   headerName: "Package",
  //   width: 90,
  // }
];

const Consultation = () => {
  const [isOpen, setOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [packages, setPackages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [selectedLead, setSelectedLead] = useState({});
  const [onboardData, setOnboardData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState();
  const { user, logout } = useUser();
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

  const fetchOnboardQuestions = useCallback(async (token) => {
    const response = await fetch(`${url}/onboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let onboard = await response.json();
    setOnboardData(onboard);
    const stepperData = formulateStepperData(onboard);
    setUserData(stepperData);
    openSnackBar(onboard);
  }, []);

  const fetchConsultations = useCallback(async (token) => {
    const response = await fetch(`${url}/consultation`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let consultations = await response.json();
    console.log(consultations, "consult");
    const rows = [];
    consultations.data.map((item) => {
      const temp = {
        id: item.id,
        dateCreated: item.dateCreated,
        email: item.basicInfo.email,
        firstName: item.basicInfo.firstName,
        lastName: item.basicInfo.lastName,
        isRecurring: item.basicInfo.isRecurring.answer,
        phone: item.basicInfo.phone,
        isSignup: item.packageQuestions.isSignup,
      };

      // item.data.map((item1) => {
      //   if (item1.key === "basicInfo") {
      //     item1.questions.map((item2) => {
      //       temp[item2.key] = item2.answer;
      //     });
      //   }
      //   if (item1.key === "packageQuestions") {
      //     item1.questions.map((item2) => {
      //       temp[item2.key] = item2.answer;
      //     });
      //   }
      // });
      rows.push(temp);
    });
    openSnackBar(consultations);
    setConsultations(rows);
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
    openSnackBar(packages);
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
      item.label = `${item.firstName} ${item.lastName} - ${item.phone}`;
    });
    setLeads(leads.data);
    openSnackBar(leads);
  }, []);

  useEffect(async () => {
    setLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchConsultations(token);
      await fetchOnboardQuestions(token);
      await fetchPackages(token);
      await fetchLeads(token);
    }
    setLoading(false);
  }, [fetchOnboardQuestions, fetchPackages, fetchLeads, fetchConsultations]);

  const formulateStepperData = (onboard) => {
    onboard = onboard.data[0].data;
    // onboard.push({
    //   key: "preview",
    //   label: "Preview",
    //   data: {},
    // });
    return onboard;
  };

  const handleChange = (value, index, position, otherAnswer) => {
    const stepperData = userData;
    console.log(index, position, value, otherAnswer, stepperData);

    if (!otherAnswer) {
      if (stepperData[index]?.questions[position]?.type === "toggle") {
        stepperData[index].questions[position].answer = value || false;
      } else stepperData[index].questions[position].answer = value;
    } else stepperData[index].questions[position].answer2 = value;

    setUserData([...stepperData]);
    // }
  };

  const handleLeadsChange = (value) => {
    setSelectedLead(value);
    const data = userData;
    if (data.length > 0) {
      data.map((item) => {
        if (item.key === "basicInfo") {
          item.questions.map((item2) => {
            if (value == null) {
              if (item2.defaultValue) {
                item2.defaultValue = "";
              }
            } else {
              if (value[item2.key]) {
                item2.defaultValue = value[item2.key];
              }
            }
          });
        }
      });
      setUserData([...data]);
    }
  };

  const createConsultation = async (body) => {
    // console.log(
    //   body,
    //   "consult body",
    //   body.consultationId,
    //   body.dateCreated,
    //   body.dateModified,
    //   selectedLead?.id
    // );

    console.log(body, "consult requestBody");
    const response = await fetch(`${url}/consultation`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      let error = await response.json();
      return error;
    }
    let consultation = await response.json();
    return consultation;
  };

  const createCustomer = async (body) => {
    const reqBody = {
      displayName: body.basicInfo.firstName,
      email: body.basicInfo.email,
      password: body.consultationId,
      role: "customer",
      leadsId: body.leadsId,
      consultationId: body.consultationId,
      notes: "hello world",
      bio: "wtf",
      contractData: {
        startDate: body.dateCreated,
        purchasedDate: body.dateCreated,
        endDate: body.dateCreated, // TODO
        addOnSessions: 0,
        specialRequest: body.packageQuestions.specialRequests,
        paid: true,
        paymentMethod: "paynow",
        packageId: body.packageQuestions.typeOfPackage,
      },
    };
    console.log(reqBody, "for customers");
    // body.data.map((item) => {
    //   if (item.key === "basicInfo") {
    //     item.questions.map((item2) => {
    //       if (item2.key === "firstName") {
    //         reqBody.displayName = selectedLead.firstName;
    //       }
    //       if (item2.key === "email") {
    //         reqBody.email = item2.answer;
    //       }
    //     });
    //   }
    //   if (item.key === "packageQuestions") {
    //     item.questions.map((item2) => {
    //       if (item2.key === "typeOfPackage") {
    //         reqBody.contractData.packageId = item2.answer;
    //       }
    //     });
    //   }
    //   item.questions.map((item2) => {
    //     if (item2.defaultValue) {
    //       item2.answer = item2.defaultValue;
    //     }
    //   });
    // });
    const response = await fetch(`${url}/customers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    if (!response.ok) {
      let error = await response.json();
      return error;
    }

    let customer = await response.json();
    return customer;
  };

  const submitResult = async () => {
    setLoading(true);
    console.log(userData, "userData");

    // request body
    const date = new Date().toLocaleString("en-SG", {
      timeZone: "Asia/Singapore",
      hour12: false,
    });
    const requestBody = {
      dateCreated: date,
      dateModified: date,
      leadsId: selectedLead?.id,
    };
    userData.map((item) => {
      requestBody[item.key] = {};
      item.questions.map((qn) => {
        if (qn.answer2) {
          requestBody[item.key][qn.key] = {
            answer: qn.answer || qn.defaultValue || false,
            answer2: qn.answer2,
          };
        } else {
          requestBody[item.key][qn.key] = qn.answer || qn.defaultValue;
        }
      });
    });

    const consultationResult = await createConsultation(requestBody);
    requestBody.consultationId = consultationResult?.data?.id;
    // if() // if no lead
    requestBody.leadsId = selectedLead?.id;
    console.log(requestBody, "after consultation", checkCustomerSignup());
    if (checkCustomerSignup()) {
      const customerResult = await createCustomer(requestBody);
      openSnackBar(customerResult);
    } else {
      openSnackBar(consultationResult);
    }
    await fetchConsultations(jwtToken);
    handleDrawer();
    setLoading(false);
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

  const checkCustomerSignup = () => {
    const isSignup = userData.map((item) => {
      if (item.key === "packageQuestions") {
        item?.questions?.map((item2) => {
          if (item2.key === "isSignup" && item.answer) {
            return true;
          }
        });
      }
    });
    return isSignup;
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
    if (!isOpen) {
      userData.map((item) => {
        item.questions &&
          item.questions.map((item2) => {
            delete item2.answer;
            delete item2.defaultValue;
          });
      });
    }

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
          <>
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
                Consultations
              </Typography>
              <Button variant="contained" onClick={toggleDrawer(true)}>
                New Consultation
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
                    New Consultation
                  </Typography>
                  <Button onClick={toggleDrawer(false)}>
                    <MdClose size={40} />
                  </Button>
                </Stack>
                <Typography
                  variant="h8"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  Select customer from existing leads data
                </Typography>
                <ComboBox
                  label={"Select Lead"}
                  options={leads}
                  handleChange={handleLeadsChange}
                ></ComboBox>
                <Stepper
                  steps={userData}
                  handleChange={handleChange}
                  submitResult={submitResult}
                  packages={packages}
                  leads={leads}
                ></Stepper>
              </Box>
            </Backdrop>
            <DataTable data={consultations} columns={columns} />
          </>
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Consultation);
