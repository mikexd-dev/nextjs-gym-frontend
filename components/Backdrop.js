import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";

export default function TemporaryDrawer({ children, toggleDrawer, isOpen }) {
  return (
    <Drawer anchor={"right"} open={isOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: "100vw",
          height: 300,
          padding: 10,
        }}
      >
        {children}
      </Box>
    </Drawer>
  );
}
