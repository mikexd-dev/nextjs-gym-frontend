import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import ComboBox from "./ComboBox";
import TextField from "./Input";

function PackageForm({
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
        label="type"
        value={data.type}
        handleChange={onChange("type")}
        isMultiline={true}
      />
      <TextField 
        label="price"
        value={data.price}
        handleChange={onChange("price")}
        isMultiline={true}
      />
      <ComboBox
        label="Select Sessions"
        options={["1", "2", "3", "4", "5", "6", "7"]}
        value={data.sessions}
        handleChange={onChange("sessions")}
        sx={{
          marginTop: "10px",
        }}
      />
      <TextField 
        label="description"
        value={data.description}
        handleChange={onChange("description")}
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
  
export default React.memo(PackageForm);
