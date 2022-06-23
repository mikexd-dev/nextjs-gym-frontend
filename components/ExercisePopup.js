import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextFieldMUI from "@mui/material/TextField";
import TextField from "../components/Input";
import Select from "../components/Select";
import Slider from "../components/Scale";
import DateTime from "../components/DateTime";
import Toggle from "../components/Toggle";
import Box from "@mui/material/Box";
import Progress from "../components/Progress";

export default function AlertDialog({
  open,
  handleClose,
  title,
  description,
  okButton,
  cancelButton,
  exercise,
  handleCreation,
  handleChange,
  tabIndex,
  qnIndex,
  exerciseIndex,
  partIndex,
  config,
}) {
  // const handleChange = (data) => {
  //   setData(data.target.value);
  // };
  // console.log(config, "config");

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(config);
  const [loading, setLoading] = useState(false);
  // const [exercise, setExercise] = useState(exercises);

  const setValue = (
    newValue,
    tabIndex,
    qnIndex,
    partIndex,
    exerciseIndex,
    index,
    options
  ) => {
    // console.log(newValue, "input", options);
    setInputValue(newValue);
    handleChange(newValue, tabIndex, qnIndex, partIndex, exerciseIndex, index);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"md"}
    >
      <Progress open={loading} />
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            rowGap: 4,
            columnGap: 5,
            paddingTop: 3,
            width: 800,
          }}
        >
          {exercise?.questions?.map((input, index) => (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                columnGap: 10,
                alignItems: "center",
              }}
            >
              {(input.type === "time-select" ||
                input.type === "date-picker" ||
                input.type === "date-time-picker") && (
                <DateTime
                  label={input.question}
                  value={input.answer}
                  type={input.type}
                  handleChange={(e) =>
                    handleChange(
                      e,
                      tabIndex,
                      qnIndex,
                      partIndex,
                      exerciseIndex,
                      index
                    )
                  }
                />
              )}
              {input.type === "toggle" && (
                <Toggle
                  label={input.question}
                  checked={input.answer || false}
                  handleChange={(e) =>
                    handleChange(
                      e.target.checked,
                      tabIndex,
                      qnIndex,
                      partIndex,
                      exerciseIndex,
                      index
                    )
                  }
                />
              )}
              {input.type === "scale" && (
                <Slider
                  label={input.question}
                  value={input.answer}
                  handleChange={(e) =>
                    handleChange(
                      e.target.value,
                      tabIndex,
                      qnIndex,
                      partIndex,
                      exerciseIndex,
                      index
                    )
                  }
                />
              )}
              {input.type === "selection" && (
                <Autocomplete
                  disablePortal
                  options={input.options}
                  sx={{ width: 350 }}
                  onChange={(e, answer) =>
                    handleChange(
                      answer.value,
                      tabIndex,
                      qnIndex,
                      partIndex,
                      exerciseIndex,
                      index
                    )
                  }
                  renderInput={(params) => (
                    <TextFieldMUI {...params} label={input.question} />
                  )}
                />
              )}
              {/* <Select
                type={input.type}
                label={input.question}
                value={input.answer}
                options={input.options}
                handleChange={(e) =>
                  handleChange(e.target.value, index, index1, false)
                }
                isMultiline={true}
              /> */}

              {input.type === "dynamic-selection" && (
                <Select
                  type={input.type}
                  label={input.question}
                  value={input.answer}
                  options={packages}
                  handleChange={(e) =>
                    handleChange(
                      e.target.value,
                      tabIndex,
                      qnIndex,
                      partIndex,
                      exerciseIndex,
                      index
                    )
                  }
                  isMultiline={true}
                />
              )}
              {input.type === "dynamic-selection-create" && (
                <Autocomplete
                  options={
                    input.dependent
                      ? exercise[input.config][exercise?.questions[3]?.answer]
                      : options[input.config]
                  }
                  noOptionsText="Enter to create a new option"
                  getOptionLabel={(option) => option}
                  onInputChange={(e, newValue) => {
                    setValue(
                      newValue,
                      tabIndex,
                      qnIndex,
                      partIndex,
                      exerciseIndex,
                      index,
                      options
                    );
                  }}
                  sx={{ width: 350 }}
                  renderInput={(params) => (
                    <TextFieldMUI
                      {...params}
                      label={input.question}
                      variant="outlined"
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          options[input.config].findIndex(
                            (o) => o === inputValue
                          ) === -1
                        ) {
                          options[input.config].push(inputValue);
                          const deepClone = JSON.parse(JSON.stringify(options));

                          setOptions(deepClone);
                        }
                      }}
                    />
                  )}
                />
              )}
              {/* {input.type === "dynamic-selection-create-dependent" && (
                <Autocomplete
                  options={
                    options["subEquipmentSettings"][
                      exercise?.questions[3]?.answer
                    ]
                  }
                  disabled={exercise?.questions[3]?.answer ? false : true}
                  noOptionsText="Enter to create a new option"
                  getOptionLabel={(option) => option}
                  onInputChange={(e, newValue) => {
                    setValue(
                      newValue,
                      tabIndex,
                      qnIndex,
                      partIndex,
                      exerciseIndex,
                      index,
                      options
                    );
                  }}
                  sx={{ width: 350 }}
                  renderInput={(params) => (
                    <TextFieldMUI
                      {...params}
                      label={input.question}
                      variant="outlined"
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          options[input.config][
                            exercise?.questions[3]?.answer
                          ].findIndex((o) => o === inputValue) === -1
                        ) {
                          options[input.config][
                            exercise?.questions[3]?.answer
                          ].push(inputValue);
                          const deepClone = JSON.parse(JSON.stringify(options));

                          setOptions(deepClone);
                        }
                      }}
                    />
                  )}
                />
              )} */}
              {input.type === "text-input" && (
                <TextFieldMUI
                  // defaultValue={input.defaultValue}
                  label={input.display}
                  value={input.answer}
                  type={input.config}
                  sx={{ width: "350px" }}
                  onChange={(e) =>
                    handleChange(
                      e.target.value,
                      tabIndex,
                      qnIndex,
                      partIndex,
                      exerciseIndex,
                      index
                    )
                  }
                  isMultiline={true}
                />
              )}
              {input.type === "text-input-reps" && (
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    columnGap: 10,
                    alignItems: "center",
                  }}
                >
                  {[1, 2].map((item) => {
                    return (
                      <TextFieldMUI
                        // defaultValue={input.defaultValue}
                        label={input.display + item}
                        value={input["answer" + item]}
                        type={input.config}
                        sx={{ width: "80px" }}
                        onChange={(e) =>
                          handleChange(
                            e.target.value,
                            tabIndex,
                            qnIndex,
                            partIndex,
                            exerciseIndex,
                            index,
                            item
                          )
                        }
                        isMultiline={true}
                      />
                    );
                  })}
                </Box>
              )}
              {input.type === "text-input-tempo" && (
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    columnGap: 10,
                    alignItems: "center",
                  }}
                >
                  {[1, 2, 3, 4].map((item) => {
                    return (
                      <TextFieldMUI
                        // defaultValue={input.defaultValue}
                        label={input.display + item}
                        value={input["answer" + item]}
                        type={input.config}
                        sx={{ width: "80px" }}
                        onChange={(e) =>
                          handleChange(
                            e.target.value,
                            tabIndex,
                            qnIndex,
                            partIndex,
                            exerciseIndex,
                            index,
                            item
                          )
                        }
                        isMultiline={true}
                      />
                    );
                  })}
                </Box>
              )}
              {input.secondType === "text-input" && (
                <TextFieldMUI
                  defaultValue={input.defaultValue}
                  label={"Others"}
                  value={input.answer2}
                  type={input.config}
                  onChange={(e) =>
                    handleChange(
                      e.target.value,
                      tabIndex,
                      qnIndex,
                      partIndex,
                      exerciseIndex,
                      index
                    )
                  }
                  isMultiline={true}
                />
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>{cancelButton}</Button>
        <Button
          onClick={async () => {
            setLoading(true);
            await handleClose(true, exercise);
            setLoading(false);
          }}
          autoFocus
        >
          {okButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
