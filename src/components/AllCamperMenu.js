import {
  Button,
  MenuItem,
  Menu,
  ListItemButton,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { useContext } from "react";
import WeekContext from "./WeekContext";

const AllCamperMenu = ({ handleParentClose,drawerMenu=false }) => {
  const { weeks } = useContext(WeekContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    handleParentClose && handleParentClose();
    setAnchorEl(null);
  };

  return (
    <>
    {drawerMenu?<ListItem>
      <ListItemButton component={Button} onClick={handleMenu}><ListItemText>Camper List</ListItemText></ListItemButton>
      </ListItem> :
      <Button
      sx={{color:"white"}}
        onClick={handleMenu}
      >
      Camper List
      </Button>}
      <Menu
        id="print-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {weeks.map((week) => (
          <MenuItem key={`dl-${week.number}`}>
            <Button
          href={`/campers/${week.number}`}
          onClick={handleClose}
            >
              Week {week.display}
            </Button>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AllCamperMenu;
