import { useState } from "react";
import firebase from "firebase/compat/app";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { MdBookmarkAdd, MdSettings } from "react-icons/md";
import { CgGym } from "react-icons/cg";
import { GiGymBag, GiTakeMyMoney } from "react-icons/gi";
import { FaUserSecret, FaUserPlus, FaUser, FaUserTie } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Link from "next/link";

const drawerWidth = 240;
const darkTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
  },
});

const adminmMenu = [
  {
    display: "Trainers",
    path: "/trainers",
    role: "admin",
  },
  {
    display: "Packages",
    path: "/packages",
    role: "admin",
  },
  {
    display: "Leads",
    path: "/leads",
    role: "admin",
  },
  {
    display: "Consultation",
    path: "/consultation",
    role: "admin",
  },
  {
    display: "Customers",
    path: "/customers",
    role: "admin",
  },
];

const trainingMenu = [
  {
    display: "Programs",
    path: "/programs",
    role: "admin",
  },
  {
    display: "Exercises",
    path: "/exercises",
    role: "admin",
  },
  {
    display: "Exercise Config",
    path: "/exercise-config",
    role: "admin",
  },
];

const settings = ["Logout"];

export default function ClippedDrawer({ children }) {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState(null);
  // const { user, logout } = useUser();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (data) => {
    setAnchorElUser(null);
  };

  const logoutUser = async (data) => {
    await logout();
    setAnchorElUser(null);
  };

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar disableGutters>
            <Box display="flex" flexGrow={1}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ mr: 2, display: "flex", padding: "0 50px" }}
              >
                Atlas Fitness
              </Typography>
            </Box>
            {/* <Box
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            ></Box> */}
            <Box sx={{ flexGrow: 0, padding: "0 30px" }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={(setting) => logoutUser(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <Link href="/home">
                <ListItem
                  button
                  key="Home"
                  selected={router.asPath === "/home"}
                >
                  <ListItemIcon>
                    <IoMdHome />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
              </Link>
            </List>
            <Divider />
            <List>
              {adminmMenu.map((obj, index) => (
                <Link href={obj.path} key={index}>
                  <ListItem
                    button
                    key={obj.display}
                    selected={router.asPath === obj.path}
                  >
                    <ListItemIcon>
                      {obj.path === "/packages" && <GiTakeMyMoney />}
                      {obj.path === "/customers" && <FaUser />}
                      {obj.path === "/trainers" && <FaUserSecret />}
                      {obj.path === "/leads" && <FaUserPlus />}
                      {obj.path === "/consultation" && <FaUserTie />}
                    </ListItemIcon>
                    <ListItemText primary={obj.display} />
                  </ListItem>
                </Link>
              ))}
            </List>
            <Divider />
            <List>
              {trainingMenu.map((obj, index) => (
                <Link href={obj.path} key={index}>
                  <ListItem
                    button
                    key={obj.display}
                    selected={router.asPath === obj.path}
                  >
                    <ListItemIcon>
                      {obj.path === "/exercises" && <CgGym />}
                      {obj.path === "/programs" && <GiGymBag />}
                      {obj.path === "/exercise-config" && <MdSettings />}
                    </ListItemIcon>
                    <ListItemText primary={obj.display} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
