import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
import { Divider } from "@mui/material";

const columns = [
  { field: "id", headerName: "Index", width: 70 },
  { field: "part", headerName: "Part", width: 120 },
  { field: "name", headerName: "Exercise", width: 150 },
  { field: "equipment", headerName: "Equipment", width: 120 },
  {
    field: "type",
    headerName: "Type",
    renderCell: (params) => {
      return (
        <Chip
          variant="outlined"
          color={params.value === "Workout" ? "primary" : "secondary"}
          label={params.value}
        />
      );
    },
    width: 100,
  },
  {
    field: "numReps",
    headerName: "Reps",
    width: 70,
  },
  {
    field: "numSets",
    headerName: "Sets",
    width: 70,
  },
  {
    field: "tempo",
    headerName: "Tempo",
    width: 100,
  },
  {
    field: "restTimeSecs",
    headerName: "Rest Time",
    width: 70,
  },
  {
    field: "notes",
    headerName: "Notes",
    width: 150,
  },
];

export default function AccordionProgram({
  programs,
  exercises,
  handleChange,
}) {
  return (
    <div>
      {programs &&
        programs.map((program, index) => (
          <Accordion defaultExpanded={index === 0 ? true : false} key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 10,
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  Program Name: [{program.programName}]
                </Typography>
                <Typography
                  sx={{
                    color: index === 0 ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {index === 0 ? "Active" : "Inactive"}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                columnGap: 10,
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  columnGap: 10,
                  alignItems: "flex-start",
                  padding: 10,
                  width: "85%",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    columnGap: 10,
                    alignItems: "flex-start",
                    padding: 10,
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      columnGap: 10,
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      Program Nature:{" "}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {program.programNature.map((item) => {
                        return (
                          <Chip
                            label={item}
                            color="primary"
                            variant="outlined"
                          />
                        );
                      })}
                    </Stack>
                  </Box>

                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      columnGap: 10,
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      Program Type:{" "}
                    </Typography>
                    {program.programType.map((item) => {
                      return (
                        <Chip label={item} color="primary" variant="outlined" />
                      );
                    })}
                  </Box>

                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      columnGap: 10,
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      Program Overview:{" "}
                    </Typography>
                    <Typography>{program.programOverview}</Typography>
                  </Box>
                </Box>
                <Divider style={{ width: "100%", margin: "20px 0" }} />
                {exercises[index]?.map((day, dayIndex) => {
                  return (
                    <div
                      style={{ height: 550, width: "100%", paddingBottom: 50 }}
                    >
                      <Typography sx={{ fontWeight: "bold", paddingBottom: 2 }}>
                        {program.days[dayIndex]?.day}:{" "}
                        {program.days[dayIndex]?.estTimeInMin} min
                      </Typography>
                      <DataGrid
                        rows={day}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[5]}
                      />
                    </div>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}
