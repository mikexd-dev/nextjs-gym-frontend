import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { MdDelete } from "react-icons/md";

export default function DeleteWithPopper({
  isPopperOpen,
  popperAnchorEl,
  popperPlacement,
  popperLabel,
  onClose,
  onConfirm,
  onClick,
}) {
  return (
    <Box>
      <Popper open={isPopperOpen} anchorEl={popperAnchorEl} placement={popperPlacement}>
        <ClickAwayListener 
          onClickAway={onClose}
        >
          <Paper>
            <Box sx={{ width: "100%", px: 2, py: 1 }}>
              <Typography sx={{ p: 2 }} variant="h6">{popperLabel}</Typography>
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={onConfirm}
              >
                Yes
              </Button>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
      <Tooltip title="Delete" placement="top">
        <IconButton
          aria-label="delete"
          onClick={onClick}
          >
          <MdDelete />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
