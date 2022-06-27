import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "./Input";
import Select from "./Select";

export default function SimpleAccordion({
  slot,
  bookAppointment,
  handleChange,
  activeCustomers,
  updateBooking,
}) {
  return (
    <div>
      <Accordion defaultExpanded={false}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            sx={{
              fontWeight: "bold",
              color: slot.totalAvailableSlots > 0 ? "green" : "red",
            }}
          >
            {" "}
            Time: {slot.start} - {slot.end} [{slot.totalAvailableSlots}/
            {slot.totalSlots}]
          </Typography>
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
          {/* {slot?.map((slot, slotIndex) => {
            return ( */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              paddingBottom: 5,
            }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                columnGap: 10,
                alignItems: "flex-start",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Time:</Typography>{" "}
              {slot.start} - {slot.end}
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                columnGap: 10,
                alignItems: "flex-start",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>
                Available Slot:
              </Typography>{" "}
              {slot.totalAvailableSlots}/{slot.totalSlots}
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                columnGap: 10,
                alignItems: "flex-start",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>
                {" "}
                Clients Booked:
              </Typography>
              {slot.customersBooked.map((item) => {
                return <div style={{ paddingLeft: 10 }}>{item.name}</div>;
              })}
            </Box>
            <Button
              variant="outlined"
              onClick={bookAppointment}
              sx={{ marginTop: 1 }}
              disabled={
                activeCustomers.length === 0 || slot.totalAvailableSlots === 0
              }
            >
              Book
            </Button>
            <Divider style={{ width: "100%", marginTop: 20 }}>Admin</Divider>
            {slot.questions.map((input, qnIndex) => {
              return (
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    columnGap: 10,
                    alignItems: "center",
                    padding: 20,
                  }}
                >
                  {input.type === "text-input" && (
                    <TextField
                      label={input.display}
                      value={input.answer}
                      defaultValue={slot[input.key]}
                      handleChange={(e) =>
                        handleChange(e.target.value, qnIndex)
                      }
                      isMultiline={true}
                    />
                  )}
                  {input.type === "dynamic-selection-config" && (
                    <Select
                      type={input.type}
                      label={input.display}
                      value={input.answer}
                      options={input.value}
                      handleChange={(e) =>
                        handleChange(e.target.value, qnIndex)
                      }
                      isMultiline={true}
                    />
                  )}
                </Box>
              );
            })}
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                columnGap: 10,
                alignItems: "center",
                padding: "0px 20px",
              }}
            >
              <Button variant="outlined" onClick={updateBooking}>
                Update Booking Slots
              </Button>
            </Box>
          </Box>
          {/* ); */}
          {/* })} */}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
