import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import TextField from "./Input";
import Select from "./Select";
import ExerciseSelect from "./ExerciseSelect";

export default function AccordionContract({
  contracts,
  sessionsLeft,
  options,
  handleChange,
}) {
  return (
    <div>
      {contracts &&
        contracts.map((contract, index) => (
          <Accordion defaultExpanded={true} key={index}>
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
                  Contract Start Date: [{contract.startDate}]
                </Typography>
                <Typography sx={{ color: "green", fontWeight: "bold" }}>
                  {" "}
                  Active
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
                  flexDirection: "row",
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
                      Purchased Date:{" "}
                    </Typography>
                    <Typography>{contract.purchasedDate}</Typography>
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
                      Start Date:{" "}
                    </Typography>
                    <Typography>{contract.startDate}</Typography>
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
                      Payment Method:{" "}
                    </Typography>
                    <Typography>{contract.paymentMethod}</Typography>
                  </Box>
                </Box>

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
                      Package Type:{" "}
                    </Typography>
                    <Typography>{contract.package.type}</Typography>
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
                      Package Price:{" "}
                    </Typography>
                    <Typography>${contract.package.price}</Typography>
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
                      Package sessions:{" "}
                    </Typography>
                    <Typography>{sessionsLeft}</Typography>
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
                      Package Description:{" "}
                    </Typography>
                    <Typography>{contract.package.description}</Typography>
                  </Box>
                </Box>
                {/* {contract.purchasedDate}
              {contract.addOnSessions}
              {contract.paymentMethod}
              {contract.paid}
              {contract.startDate} */}
                {/* {contract.package.name}
              {contract.package.price}
              {contract.package.type}
              {contract.package.sessions}
              {contract.package.description}
              {contract.endDate}
              {contract.specialRequests} */}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}
