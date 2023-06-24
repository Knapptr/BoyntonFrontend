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
import useDownloadLink from "../hooks/useGetDownloadLink";
import WeekContext from "./WeekContext";

const DownloadAwardsMenu = ({ handleParentClose,drawerMenu=false }) => {
  const { weeks } = useContext(WeekContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [ download ] = useDownloadLink();
  const handleMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    handleParentClose && handleParentClose();
    setAnchorEl(null);
  };
  const handleItemClick = async (week) => {
    handleClose();
    const url = `/api/awards/${week.number}/print`;
    await download(url,`awards-week${week.display}.pptx`);
  };

  return (
    <>
    {drawerMenu?<ListItem>
      <ListItemButton component={Button} onClick={handleMenu}><ListItemText>Print Awards</ListItemText></ListItemButton>
      </ListItem> :
      <Button
        color="primary"
        onClick={handleMenu}
      >
        Print Awards
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
              onClick={() => {
                handleItemClick(week);
              }}
            >
              Week {week.display}
            </Button>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DownloadAwardsMenu;
