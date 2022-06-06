import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import { MdDelete, MdExpandLess, MdExpandMore } from "react-icons/md";
import Collapse from "@mui/material/Collapse";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function InteractiveList({ header, data, deleteData, type }) {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <Demo>
        <List>
          {type !== "sub" &&
            data &&
            Object.keys(data).map((key) => (
              <ListItemButton>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteData(header, data, key)}
                    >
                      <MdDelete />
                    </IconButton>
                  }
                >
                  <ListItemText primary={data[key]} />
                </ListItem>
              </ListItemButton>
            ))}
          {type === "sub" &&
            data &&
            Object.keys(data).map((key) => (
              <>
                <ListItemButton onClick={handleClick}>
                  <ListItemText
                    primary={key}
                    sx={{
                      color: "lightgoldenrodyellow",
                    }}
                  />
                  {open ? <MdExpandMore /> : <MdExpandLess />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {Object.keys(data[key]).map((item) => (
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText
                          primary={data[key][item]}
                          sx={{ width: 500 }}
                        />
                        <ListItem
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() =>
                                deleteData(header, data, key, item)
                              }
                            >
                              <MdDelete />
                            </IconButton>
                          }
                        ></ListItem>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ))}
        </List>
      </Demo>
    </Box>
  );
}
