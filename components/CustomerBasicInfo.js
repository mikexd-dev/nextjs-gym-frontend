import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import TextField from "./Input";

export default function BasicInfoForm({
  isSubmitEnabled,
  data,
  buttonLabel,
  onChange,
  onSubmit,
}) {
  return (
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
        spacing={2}
        sx={{ width: "100%" }}
        alignItems="flex-start"
        rowGap={3}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
          }}
        >
          <TextField
            defaultValue=""
            label="Name"
            value={data.name}
            handleChange={onChange("name")}
            isMultiline={true}
          />
          <TextField
            defaultValue=""
            label="Email"
            value={data.email}
            handleChange={onChange("email")}
            isMultiline={true}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
          }}
        >
          <TextField
            defaultValue=""
            label="Phone"
            value={data.phone}
            handleChange={onChange("phone")}
            isMultiline={true}
          />
          <TextField
            defaultValue=""
            label="Address"
            value={data.address}
            handleChange={onChange("address")}
            isMultiline={true}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
          }}
        >
          <TextField
            defaultValue=""
            label="Sessions Left"
            value={data.sessionsLeft}
            disabled={true}
            isMultiline={true}
          />
          <TextField
            defaultValue=""
            label="notes"
            value={data.notes}
            handleChange={onChange("notes")}
            isMultiline={true}
          />
        </Box>

        <Stack
          direction="column"
          spacing={1}
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ width: "100%", paddingBottom: 5 }}
        >
          <Button
            disabled={!isSubmitEnabled}
            variant="contained"
            onClick={onSubmit}
            sx={{ mt: 1, mr: 1 }}
          >
            Save Changes
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
