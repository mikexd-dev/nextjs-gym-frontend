import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import TextField from "./Input";

export default function TrainerForm({
    isSubmitEnabled,
    data,
    onChange,
    onSubmit
}) {
  return (
    <Stack spacing={2} sx={{ width: "100%" }} alignItems="center">
      <TextField 
        defaultValue=""
        label="Name"
        value={data.name}    
        handleChange={onChange("name")}
        isMultiline={true}
      />
      <TextField 
        defaultValue=""
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
          Submit
        </Button>
      </Stack>
    </Stack> 
  );
}
  