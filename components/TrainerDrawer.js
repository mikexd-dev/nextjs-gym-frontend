import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MdClose } from "react-icons/md";

import Backdrop from "../components/Backdrop";
import TrainerForm from "../components/TrainerForm";

export default function TrainerDrawer({
  setDrawerOpen,
  isDrawerOpen,
  title,
  formData,
  submitButtonLabel,
  isSubmitEnabled,
  onChange,
  onSubmit,
  onDrawerClose
}) {
  return (
    <Backdrop toggleDrawer={()=>setDrawerOpen} isOpen={isDrawerOpen}>
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
            {title}
          </Typography>
          <Button onClick={onDrawerClose}>
            <MdClose size={40} />
          </Button>
        </Stack>

        <TrainerForm
          data={formData}
          onChange={onChange}
          onSubmit={onSubmit}
          isSubmitEnabled={isSubmitEnabled}
          buttonLabel={submitButtonLabel}
        />
      </Box>
    </Backdrop>
  );
}
  