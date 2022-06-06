import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function AlertDialog({
  open,
  handleClose,
  title,
  description,
  okButton,
  cancelButton,
  isDialogForm,
  selectForm,
  handleSelectChange,
  selectValue,
}) {
  const [data, setData] = React.useState(undefined);

  const handleTextChange = (data) => {
    setData(data.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {selectForm?.type === "sub" && (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectValue}
            label={selectForm.question}
            onChange={handleSelectChange}
            variant="standard"
            sx={{
              width: 400,
            }}
          >
            {Object.keys(selectForm.options).map((key) => (
              <MenuItem value={selectForm.options[key]}>
                {selectForm.options[key]}
              </MenuItem>
            ))}
          </Select>
        )}
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
        {isDialogForm && (
          <TextField
            autoFocus
            sx={{
              width: 400,
            }}
            id="config"
            multiline={true}
            maxRows={4}
            label="Config"
            fullWidth
            variant="standard"
            onChange={handleTextChange}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>{cancelButton}</Button>
        <Button onClick={() => handleClose(true, data)} autoFocus>
          {okButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
