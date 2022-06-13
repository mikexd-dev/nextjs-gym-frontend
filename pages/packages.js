import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { MdClose, MdEdit } from "react-icons/md";

import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import { getUserFromCookie } from "../auth/userCookie";
import Backdrop from "../components/Backdrop";
import DataTable from "../components/DataTable";
import DeleteWithPopper from "../components/DeleteWithPopper";
import Drawer from "../components/Drawer";
import PackageForm from "../components/PackageForm";
import Progress from "../components/Progress";
import Snackbar from "../components/Snackbar";
import { url } from "../urlConfig";

const packageDataInitialValue = { 
  name: "",
  type: "",
  price: "",
  sessions: "1", 
  description: "",
};
const API_SUCCESS_STATUS = "success";


const Packages = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isPopperOpen, setPopperOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: "", severity: "" });
  const [packages, setPackages] = useState([]);
  const [packageFormData, setPackageFormData] = useState(
    packageDataInitialValue
  );
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [jwtToken, setJwtToken] = useState();

  const router = useRouter();

  const isSubmitEnabled = Object.values(packageFormData).every(value => !!value);
  
  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      setIsLoading(true);
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
    setIsLoading(true);
    const token = getUserFromCookie()?.token;
    if (token) {
      setJwtToken(token);
      await fetchPackages(token);
    }
    setIsLoading(false);
  }, [fetchPackages]);

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

  const handleCloseDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
    setPackageFormData(packageDataInitialValue);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const closePopper = () => {
    setPopperOpen(false);
  };

  const handlePackageFormChange = (property) => (e) => {
    const value = e?.target?.value ?? e;
    if (!value) return;
    const packageData = { ...packageFormData, [property]: e?.target?.value ?? e};
    setPackageFormData(packageData);
  }

  const createNewPackage = async (body) => {
    try {
      const response = await fetch(`${url}/packages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      return result;
    } catch {
      return { message: "Something goes wrong" };
    }
  };
  
  const handleAddNewPackage = async () => {
    const response = await createNewPackage(packageFormData);
    openSnackBar(response);
    setPackageFormData(packageDataInitialValue);
    setDrawerOpen(false);
    if(response?.status === API_SUCCESS_STATUS) {
      await fetchPackages(jwtToken);
    }
  }

  const updatePackage = async (body) => {
    try {
      const response = await fetch(`${url}/packages/${packageFormData.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      return result;
    } catch {
      return { message: "Something went wrong" };
    }
  };

  const handleUpdatePackage = async () => {
    const response = await updatePackage(packageFormData);
    openSnackBar(response);
    setDrawerOpen(false);
    setPackageFormData(packageDataInitialValue);
    if(response?.status === API_SUCCESS_STATUS) {
      await fetchPackages(jwtToken);
    }
  }

  const handleEditClick = (id) => () => {
    const selectedPackage = packages.find((exercisePackage) => exercisePackage.id === id);
    setPackageFormData(selectedPackage);
    setDrawerOpen(true);
  };

  const deletePackage = async () => {
    try {
      const response = await fetch(`${url}/packages/${selectedPackageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      openSnackBar(result);
      if (response.ok) {
        await fetchPackages(jwtToken);
      };
    } catch {
      openSnackBar({message: "Something went wrong"});
    }
    setSelectedPackageId("");
    closePopper();
  };

  const handleDeletePackage = (id) => (event)  => {
    setSelectedPackageId(id);
    setAnchorEl(event.currentTarget);
    setPopperOpen(true);
  }

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
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <DeleteWithPopper
            isPopperOpen={isPopperOpen}
            popperAnchorEl={anchorEl}
            popperPlacement="top"
            popperLabel="Confirm delete?"
            onClose={closePopper}
            onConfirm={deletePackage}
            onClick={handleDeletePackage(id)}
          />,
          <Tooltip title="Edit" placement="top">
            <IconButton aria-label="edit" onClick={handleEditClick(id)}>
              <MdEdit />
            </IconButton>
          </Tooltip>,
        ];
      },
    },
  ];

  return (
    <>
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
              Packages
            </Typography>
            <Button variant="contained" onClick={() => setDrawerOpen(true)}>
              New Package
            </Button>
          </Stack>

          <Backdrop toggleDrawer={() => setDrawerOpen} isOpen={isDrawerOpen}>
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
                 {packageFormData.id ? "Update Package" : "New Package"}
                </Typography>
                <Button onClick={handleCloseDrawer}>
                  <MdClose size={40} />
                </Button>
              </Stack>
              <PackageForm
                data={packageFormData}
                onChange={handlePackageFormChange}
                onSubmit={
                  packageFormData.id ? handleUpdatePackage : handleAddNewPackage
                }
                isSubmitEnabled={isSubmitEnabled}
                buttonLabel={packageFormData.id ? "Update" : "Submit"}
              />
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
