import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { format, addMonths, addWeeks } from "date-fns";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";

import CustomerDrawer from "../../components/CustomerDrawer";
import Drawer from "../../components/Drawer";
import Progress from "../../components/Progress";
import Snackbar from "../../components/Snackbar";
import withAuth from "../../auth/withAuth";
import { useUser } from "../../auth/useUser";
import { getUserFromCookie } from "../../auth/userCookie";
import { url } from "../../urlConfig";

const Customer = () => {
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
        {
          key: "programSubName",
          display: "Program SubName",
          type: "text-input",
        },
        { key: "dateStarted", display: "StartingDate", type: "date-picker" },
        {
          key: "totalNumberOfWeeks",
          display: "Number of Weeks",
          type: "text-input",
          config: "number",
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

  const router = useRouter();
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: "", severity: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setCustomer] = useState({});
  const [jwtToken, setJwtToken] = useState();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [config, setConfig] = useState({});
  const [tabColumnData, setTabColumnData] = useState(tabColumns);
  const [newMeasurement, setNewMeasurement] = useState({});
  const [newContract, setNewContract] = useState({});
  const [packages, setPackages] = useState([]);

  const { pid } = router.query;

  const formatContractData = (item) => {
    let totalSessions = 0;
    item.contract.map((contract) => {
      totalSessions += Number(contract.package.sessions);
      contract.startDate = format(new Date(contract.startDate), "dd MMM yyyy");
      contract.endDate = format(new Date(contract.endDate), "dd MMM yyyy");
      contract.purchasedDate = format(
        new Date(contract.purchasedDate),
        "dd MMM yyyy"
      );
    });
    item.sessionsLeft = `${
      totalSessions - item.sessions.length
    }/${totalSessions}`;
    item.sessionsRemaining = totalSessions - item.sessions.length;

    return item;
  };

  const formatMeasurement = (item) => {
    item.measurement.map((measurement) => {
      measurement.date = format(new Date(measurement.date), "dd MMM yyyy");
    });

    return item;
  };

  const formatSession = (item) => {
    item.sessions.map((sess) => {
      sess.completedDate = format(new Date(sess.completedDate), "dd MMM yyyy");
      sess.trainerName = sess.trainerId.name;
    });

    return item;
  };

  const formatBooking = (item) => {
    item.bookings.map((booking) => {
      booking.date = format(new Date(booking.date), "dd MMM yyyy");
    });

    return item;
  };

  const fetchCustomer = useCallback(async (id, token) => {
    // // console.log(id, "id");
    const response = await fetch(`${url}/customers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    const data = await response.json();
    let customerData = formatContractData(data?.data);
    customerData = formatMeasurement(customerData);
    customerData = formatSession(customerData);
    customerData = formatBooking(customerData);
    // customerData.map((item) => {
    //   item = formatContractData(item);
    // });
    // console.log(customerData, " consult");
    setCustomer(customerData);
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

  useEffect(async () => {
    setIsLoading(true);
    const token = getUserFromCookie()?.token;
    if (token && pid) {
      setJwtToken(token);
      await fetchCustomer(pid, token);
      await fetchConfig(token);
      await fetchPackages(token);
    }
    setIsLoading(false);
  }, [pid, fetchCustomer]);

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

  function handleClick(event) {
    event.preventDefault();
    // console.info("You clicked a breadcrumb.");
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

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

  const editCustomer = async (body) => {
    const response = await fetch(`${url}/customers/${selectedCustomer.id}`, {
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
      setCustomer({});
      return;
    }
    const customerUpdated = await response.json();
    // console.log(customerUpdated, "lionel");
    let customerData = formatContractData(customerUpdated?.data);
    customerData = formatMeasurement(customerData);
    customerData = formatSession(customerData);
    customerData = formatBooking(customerData);
    setCustomer(customerData);
    openSnackBar(customerUpdated);
  };

  const updateCustomerProgramme = async (requestBody, id) => {
    // console.log(id, "updating customer");
    const response = await fetch(`${url}/customers/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program: requestBody?.data?.id,
      }),
    });
    if (!response.ok) {
      let error = await response.json();
      return error;
    }
    let updateResult = await response.json();
    let customerData = formatContractData(updateResult?.data);
    customerData = formatMeasurement(customerData);
    customerData = formatSession(customerData);
    customerData = formatBooking(customerData);
    return customerData;
  };

  const handleMeasurement = (property) => (e) => {
    // console.log("measurement changes", [property], e.target.value);
    const measurement = { ...newMeasurement, [property]: e.target.value };
    // console.log(Object.keys(measurement).length, "measurement length");
    if (Object.keys(measurement).length >= 10) {
      const {
        chest,
        abdominal,
        thigh,
        bicep,
        tricep,
        subscapular,
        suprailiac,
        lowerback,
        calf,
        weight,
      } = measurement;
      const total9 =
        Number(chest) +
        Number(abdominal) +
        Number(thigh) +
        Number(bicep) +
        Number(tricep) +
        Number(subscapular) +
        Number(suprailiac) +
        Number(lowerback) +
        Number(calf);
      const weightCal = weight * 2.2;
      measurement.bodyFat = ((total9 * 27) / weightCal).toFixed(2);
      measurement.bodyFatInKg = (weight * (measurement.bodyFat / 100)).toFixed(
        2
      );
      measurement.leanBodyWeight = (weight - measurement.bodyFatInKg).toFixed(
        2
      );
    }
    // console.log(
    //   JSON.stringify(measurement),
    //   "measurement",
    //   total9 * 27,
    //   weightCal
    // );
    setNewMeasurement(measurement);
  };

  const handleContract = (property) => (e) => {
    console.log("contract changes", [property], e);
    let contract;
    if (property === "startDate") {
      contract = { ...newContract, [property]: e };
    } else if (property === "package") {
      const packageId = e.target.value;
      const packageData = packages.find((item) => item.id === packageId);
      contract = { ...newContract, ...packageData };
    } else {
      contract = { ...newContract, [property]: e.target.value };
    }
    console.log(contract, "contract");
    setNewContract(contract);
  };

  const handleCustomerFormChange = (property) => (e) => {
    const customerData = { ...selectedCustomer, [property]: e.target.value };
    setCustomer(customerData);
    // console.log(customerData, "customerdata");
    // const isAllFilled = !!customerData.name && !!customerData.expertise;
    setIsSubmitEnabled(true);
  };

  const handleUpdateCustomer = async () => {
    setIsLoading(true);
    const data = {
      id: selectedCustomer.id,
      name: selectedCustomer.name,
      phone: selectedCustomer.phone,
      email: selectedCustomer.email,
      address: selectedCustomer.address,
      name: selectedCustomer.name,
    };
    await editCustomer(data);
    setDrawerOpen(false);
    await fetchCustomer(pid, jwtToken);
    setIsLoading(false);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    selectedCustomer({});
  };

  const createProgram = async (body) => {
    const response = await fetch(`${url}/program`, {
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
    let program = await response.json();
    // console.log(program, "program result");
    return program;
  };

  const createMeasurement = async () => {
    const measurementData = newMeasurement;
    measurementData.date = new Date().toISOString();
    measurementData.customerId = selectedCustomer.id;
    const response = await fetch(`${url}/measurement`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(measurementData),
    });
    if (!response.ok) {
      let error = await response.json();
      return error;
    }
    let measurement = await response.json();
    // console.log(measurement, "measurement result");
    return measurement.data;
  };

  const handleNewMeasurement = async () => {
    setIsLoading(true);
    // console.log(newMeasurement, "new measurement");
    const result = await createMeasurement();
    // console.log(result, "measurement result");
    // update customer
    // set customer
    const body = { measurement: result.id };
    await editCustomer(body);
    resetMeasurement();
    setIsLoading(false);
  };

  const resetMeasurement = () => {
    setNewMeasurement({});
  };

  const createContract = async () => {
    const contractData = newContract;
    const body = {
      packageId: contractData.id,
      startDate: contractData.startDate,
      endDate: addMonths(contractData.startDate, 3),
      purchasedDate: new Date().toISOString(),
      addOnSessions: 0,
      specialRequest: "",
      paid: true,
      paymentMethod: contractData.paymentMethod,
    };

    console.log(body, "contractData");

    const response = await fetch(`${url}/contracts`, {
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
    let contract = await response.json();
    // console.log(measurement, "measurement result");
    return contract.data;
  };

  const handleNewContract = async () => {
    setIsLoading(true);
    // console.log(newMeasurement, "new measurement");
    const result = await createContract();
    // console.log(result, "measurement result");
    // update customer
    // set customer
    const body = { contract: result.id };
    await editCustomer(body);
    resetContract();
    setIsLoading(false);
  };

  const resetContract = () => {
    setNewContract({});
  };

  const resetProgram = () => {
    setTabColumnData(tabColumns);
  };

  const submitProgramData = async (programTabs) => {
    setIsLoading(true);
    // console.log(programTabs, "new program");
    const date = new Date().toISOString();

    let requestBody = {
      days: [],
      dateCreated: date,
      weeksCompleted: 0,
    };
    programTabs.map((item) => {
      if (item.type === "days") {
        const day = Number(item.headerName.slice(-1)) - 1;
        requestBody.days[day] = {
          day: item.headerName,
          estTime: 0,
          estTimeInMin: "",
        };
        // console.log(day, "day");
        item.content.map((question, dayIndex) => {
          // console.log(question, "question", requestBody);
          if (question.key === "day") {
            requestBody.days[day].workout = [];
            question.parts.map((part, partIndex) => {
              requestBody.days[day].workout[partIndex] = {
                exercisePart: part.display,
                estTime: part.estTime,
                exercises: [],
              };
              requestBody.days[day].estTime += Number(part.estTime);
              part.exercises.map((exercise, exerciseIndex) => {
                requestBody.days[day].workout[partIndex].exercises[
                  exerciseIndex
                ] = {};
                exercise.questions.map((item) => {
                  // console.log(day, item, requestBody);
                  requestBody.days[day].workout[partIndex].exercises[
                    exerciseIndex
                  ][item.key] = item.answer;

                  // requestBody.days[day][item.key] = item.answer;
                });
              });
            });
            requestBody.days[day].estTimeInMin =
              Math.floor(Number(requestBody.days[day].estTime) / 60) +
              "m" +
              (Number(requestBody.days[day].estTime) % 60) +
              "s";
          } else {
            if (question.answer)
              requestBody.days[day][question.key] = question.answer;
          }
        });
      } else {
        item.content.map((question) => {
          if (question.answer) requestBody[question.key] = question.answer;
        });
      }
    });

    !requestBody.dateStarted ? (requestBody.dateStarted = date) : null;
    // console.log(requestBody, "final");
    const programResult = await createProgram(requestBody);
    // console.log(selectedCustomer, "activeCustomers");
    const result = await updateCustomerProgramme(
      programResult,
      selectedCustomer.id
    );
    // console.log(result, "customer result", selectedCustomer);
    setCustomer(result);
    openSnackBar(result);
    const data = tabColumns;
    data[0].content.map((item) => (item.answer = ""));
    setTabColumnData(JSON.parse(JSON.stringify(data)));
    setIsLoading(false);
    // setDrawerOpen(false);
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

  const updateConfig = async (body) => {
    // console.log(body, "action config result");
    const response = await fetch(`${url}/config/${body.id}`, {
      method: "PATCH",
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
    let config = await response.json();
    openSnackBar(config);
    let result = config.data;
    setConfig(result);
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
      <Drawer>
        <div
          role="presentation"
          onClick={handleClick}
          style={{ marginBottom: "20px" }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/customers">
              Customers
            </Link>
            <Typography color="text.primary">
              {selectedCustomer.name}
            </Typography>
          </Breadcrumbs>
        </div>

        <CustomerDrawer
          setDrawerOpen={setDrawerOpen}
          isDrawerOpen={isDrawerOpen}
          title={selectedCustomer.id ? "Customer Profile" : ""}
          formData={selectedCustomer}
          submitButtonLabel={selectedCustomer.id ? "Update" : "Submit"}
          isSubmitEnabled={isSubmitEnabled}
          onChange={handleCustomerFormChange}
          onSubmit={handleUpdateCustomer}
          onDrawerClose={handleCloseDrawer}
          config={config}
          onCreateProgram={submitProgramData}
          tabColumns={tabColumnData}
          isCustomerLoading={isLoading}
          updateConfig={updateConfig}
          onSubmitMeasurement={handleNewMeasurement}
          onMeasurementChange={handleMeasurement}
          measurementData={newMeasurement}
          resetMeasurement={resetMeasurement}
          resetProgram={resetProgram}
          onSubmitContract={handleNewContract}
          onContractChange={handleContract}
          contractData={newContract}
          resetContract={resetContract}
          packages={packages}
        />
      </Drawer>
    </div>
  );
};

export default Customer;
