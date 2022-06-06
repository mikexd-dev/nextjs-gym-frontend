import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import { getUserFromCookie } from "../auth/userCookie";
import Drawer from "../components/Drawer";
import DynamicList from "../components/List";
import Progress from "../components/Progress";
import Snackbar from "../components/Snackbar";
import Dialog from "../components/Dialog";
import { url } from "../urlConfig";

const columns = [
  {
    tab: "bodyParts",
    headerName: "Body Part",
    content: [
      { name: "bodyParts", display: "Body Parts" },
      // { name: "exerciseName", display: "Exercise Name" },
    ],
  },
  {
    tab: "equipmentSettings",
    headerName: "Equipment Settings",
    content: [
      { name: "equipmentSettings", display: "Equipment Settings" },
      {
        name: "subEquipmentSettings",
        display: "Sub Equipment Settings",
        type: "sub",
      },
    ],
  },
  {
    tab: "setup",
    headerName: "Set Up",
    content: [
      { name: "generalSetup", display: "General Setup" },
      { name: "upperSetup", display: "Upper Body Setup" },
      { name: "lowerSetup", display: "Lower Body Setup" },
    ],
  },
  {
    tab: "implements",
    headerName: "Implements",
    content: [
      { name: "implements", display: "Implementations" },
      { name: "executions", display: "Executions" },
    ],
  },
  {
    tab: "progressions",
    headerName: "Progressions",
    content: [{ name: "progressions", display: "Progressions" }],
  },
  {
    tab: "caution",
    headerName: "Caution",
    content: [{ name: "caution", display: "Caution" }],
  },
  {
    tab: "strengthQuality",
    headerName: "Strength Quality",
    content: [{ name: "strengthQuality", display: "Strength Quality" }],
  },
];

const ExerciseConfig = () => {
  const { user, logout } = useUser();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [deleteData, setDeleteData] = useState({});
  const [dialogData, setDialogData] = useState({});
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState();
  const [selectValue, setSelectValue] = useState("");
  const [value, setValue] = useState("bodyParts");
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateConfig = async (body) => {
    const response = await fetch(`${url}/config/TlUivwEwlkdkMRwSHKXS`, {
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

  const fetchConfig = useCallback(async (token, query) => {
    const response = await fetch(`${url}/config/TlUivwEwlkdkMRwSHKXS`, {
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
    let result = data.data;
    setConfig(result);
  }, []);

  useEffect(async () => {
    setLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchConfig(token, "bodyParts");
    }
    setLoading(false);
  }, [fetchConfig]);

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

  const onDelete = async () => {
    const { header, key, data, item } = deleteData;
    const configData = config;
    if (item) {
      configData[header.name][key].splice(item, 1);
    } else {
      configData[header.name].splice(key, 1);
    }

    await updateConfig(configData);
  };

  const openDialog = (header, data, key, item) => {
    setDialogData({
      title: "Delete Config",
      description: "Are you sure you want to delete this?",
      okButton: "Delete",
      cancelButton: "Cancel",
      isDialogForm: false,
    });
    setDeleteData({ header, data, key, item });
    setDialogOpen(true);
  };

  const handleDialogClose = async (isAction, data) => {
    if (isAction === true && !dialogData.isDialogForm) {
      setLoading(true);
      await onDelete();
      setLoading(false);
    } else if (isAction === true && dialogData.isDialogForm) {
      setLoading(true);
      await addConfig(data);
      setLoading(false);
    }
    setDialogOpen(false);
  };

  const addConfig = async (data) => {
    const configData = config;
    if (dialogData.content.type === "sub") {
      if (configData[dialogData.content.name][selectValue])
        configData[dialogData.content.name][selectValue].push(data);
      else {
        configData[dialogData.content.name][selectValue] = [];
        configData[dialogData.content.name][selectValue].push(data);
      }
    } else {
      configData[dialogData.content.name].push(data);
    }

    await updateConfig(configData);
  };

  const handleSelectChange = (data) => {
    setSelectValue(data.target.value);
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
      <Dialog
        open={isDialogOpen}
        handleClose={handleDialogClose}
        title={dialogData.title}
        description={dialogData.description}
        okButton={dialogData.okButton}
        cancelButton={dialogData.cancelButton}
        isDialogForm={dialogData.isDialogForm}
        selectForm={dialogData.selectForm}
        selectValue={selectValue}
        handleSelectChange={dialogData.handleSelectChange}
      />
      {user?.email && (
        <Drawer>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  {columns.map((item) => {
                    return <Tab label={item.headerName} value={item.tab} />;
                  })}
                </TabList>
              </Box>
              {columns.map((item) => {
                return (
                  <TabPanel value={item.tab}>
                    {item.content.map((content) => {
                      return (
                        <>
                          <Stack
                            direction="row"
                            spacing={20}
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              width: "100%",
                              paddingBottom: "10px",
                              paddingTop: "20px",
                            }}
                          >
                            <Typography
                              variant="h5"
                              gutterBottom
                              sx={{
                                fontWeight: "bold",
                              }}
                            >
                              {content.display}
                            </Typography>
                            <Button
                              variant="contained"
                              onClick={() => {
                                setDialogData({
                                  title: "New Config",
                                  okButton: "Add",
                                  cancelButton: "Cancel",
                                  isDialogForm: true,
                                  callback: addConfig,
                                  content: content,
                                  selectForm: {
                                    type: content.type,
                                    question: "select type",
                                    options: config["equipmentSettings"],
                                  },
                                  handleSelectChange: handleSelectChange,
                                });
                                setSelectValue(config["equipmentSettings"][0]);
                                setDialogOpen(true);
                              }}
                            >
                              New {content.display}
                            </Button>
                          </Stack>
                          <DynamicList
                            header={content}
                            data={config[content.name]}
                            deleteData={openDialog}
                            type={content.type}
                          />
                        </>
                      );
                    })}
                  </TabPanel>
                );
              })}
            </TabContext>
          </Box>
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(ExerciseConfig);
