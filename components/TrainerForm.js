import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import TextField from "./Input";

export default function TrainerForm({
    isSubmitEnabled,
    data,
    buttonLabel,
    onChange,
    onSubmit
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
      <Stack spacing={2} sx={{ width: "100%" }} alignItems="center">
        <TextField 
          label="Name"
          value={data.name}    
          handleChange={onChange("name")}
          isMultiline={true}
        />
        <TextField 
          label="Expertise"
          value={data.expertise}
          handleChange={onChange("expertise")}
          isMultiline={true}
        />
        <Stack
          direction="column"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%", paddingBottom: 5 }}
        >
          <Button
            disabled={!isSubmitEnabled}
            variant="contained"
            onClick={onSubmit}
            sx={{ mt: 1, mr: 1 }}
          >
            {buttonLabel}
          </Button>
        </Stack>
      </Stack> 
    </Box>
  );
}
  