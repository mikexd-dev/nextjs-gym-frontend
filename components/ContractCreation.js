import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MdClose } from "react-icons/md";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Select from "./Select";
import DateTime from "./DateTime";
// import TextField from "./Input";

export default function BasicInfoForm({
  data,
  onChange,
  submitResult,
  closeContractDrawer,
  packages,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        rowGap: "10px",
        padding: "0 50px",
      }}
    >
      <Stack
        direction="row"
        spacing={50}
        justifyContent="center"
        alignItems="flex-end"
        sx={{ width: "100%", height: "120px" }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "bold",
          }}
        >
          New Contract
        </Typography>
        <Button onClick={closeContractDrawer(true)}>
          <MdClose size={40} />
        </Button>
      </Stack>
      <Stack
        spacing={2}
        sx={{ width: "100%", paddingTop: "30px" }}
        alignItems="center"
        rowGap={3}
      >
        <Select
          label={"Type of Package"}
          type="dynamic-selection"
          value={data.package}
          options={packages}
          handleChange={onChange("package")}
          isMultiline={true}
        />

        <TextField
          defaultValue=""
          label="Payment Method"
          sx={{
            width: 400,
          }}
          value={data.paymentMethod}
          onChange={onChange("paymentMethod")}
          isMultiline={true}
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ width: 400 }}>
          <DateTime
            label={"Start Date"}
            value={data.startDate}
            type={"date-picker"}
            handleChange={onChange("startDate")}
          />
        </Box>

        <Stack
          direction="column"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%", paddingBottom: 5 }}
        >
          <Button
            variant="contained"
            onClick={submitResult}
            sx={{ mt: 1, mr: 1 }}
          >
            Create Contract
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
