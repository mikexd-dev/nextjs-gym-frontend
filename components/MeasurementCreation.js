import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MdClose } from "react-icons/md";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
// import TextField from "./Input";

export default function BasicInfoForm({
  data,
  onChange,
  submitResult,
  closeMeasurementDrawer,
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
          New Measurement
        </Typography>
        <Button onClick={closeMeasurementDrawer(true)}>
          <MdClose size={40} />
        </Button>
      </Stack>
      <Stack
        spacing={2}
        sx={{ width: "100%", paddingTop: "30px" }}
        alignItems="center"
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
            label="Chest (in mm)"
            type="number"
            sx={{
              width: 300,
            }}
            value={data.chest}
            onChange={onChange("chest")}
            isMultiline={true}
          />
          <TextField
            defaultValue=""
            label="Abdominal (in mm)"
            type="number"
            sx={{
              width: 300,
            }}
            value={data.abdominal}
            onChange={onChange("abdominal")}
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
            label="Thigh (in mm)"
            type="number"
            sx={{
              width: 300,
            }}
            value={data.thigh}
            onChange={onChange("thigh")}
            isMultiline={true}
          />
          <TextField
            defaultValue=""
            label="Bicep (in mm)"
            type="number"
            sx={{
              width: 300,
            }}
            value={data.bicep}
            onChange={onChange("bicep")}
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
            label="Tricep (in mm)"
            type="number"
            value={data.tricep}
            sx={{
              width: 300,
            }}
            onChange={onChange("tricep")}
            isMultiline={true}
          />
          <TextField
            defaultValue=""
            label="Subscapular (in mm)"
            type="number"
            sx={{
              width: 300,
            }}
            value={data.subscapular}
            onChange={onChange("subscapular")}
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
            label="Suprailiac (in mm)"
            type="number"
            sx={{
              width: 300,
            }}
            value={data.suprailiac}
            onChange={onChange("suprailiac")}
            isMultiline={true}
          />
          <TextField
            defaultValue=""
            label="Lower Back (in mm)"
            type="number"
            sx={{
              width: 300,
            }}
            value={data.lowerback}
            onChange={onChange("lowerback")}
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
            label="Calf (in mm)"
            type="number"
            sx={{
              width: 300,
            }}
            value={data.calf}
            onChange={onChange("calf")}
            isMultiline={true}
          />

          <TextField
            defaultValue=""
            label="Weight (in kg)"
            type="number"
            sx={{
              width: 300,
            }}
            value={data.weight}
            onChange={onChange("weight")}
            isMultiline={true}
          />
        </Box>

        <Divider style={{ width: "50%", marginTop: 20 }}>
          {" "}
          <Chip label="Calculations" />
        </Divider>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 5,
          }}
        >
          <TextField
            defaultValue=""
            label="Body Fat (%)"
            type="number"
            sx={{
              width: 300,
            }}
            disabled={true}
            value={data.bodyFat}
            isMultiline={true}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            defaultValue=""
            label="Body Fat (kg)"
            type="number"
            sx={{
              width: 300,
            }}
            disabled={true}
            value={data.bodyFatInKg}
            isMultiline={true}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            defaultValue=""
            label="Lean Weight (kg)"
            type="number"
            sx={{
              width: 300,
            }}
            disabled={true}
            value={data.leanBodyWeight}
            isMultiline={true}
            InputLabelProps={{ shrink: true }}
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
            Create Measurement
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
