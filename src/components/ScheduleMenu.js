import { Button, Typography, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { NavMenuButton } from "./NavDrawer";
import StaffScheduleMenu from "./StaffScheduleMenu";

const ScheduleMenu = ({ title, items, onClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleItemClick = (item) => {
    onClick && onClick(item);
    handleClose();
  };
  return (
    <>
      <NavMenuButton onClick={handleMenu}>
        <Typography>{title}</Typography>
      </NavMenuButton>
      <Menu
        id="menu-appbar"
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
    <MenuItem>
    <StaffScheduleMenu textColor="primary.main" handleParentClose={()=>{handleClose()}}/>
    </MenuItem>
        {items.map((item) => (
          <MenuItem key={`menuItem-${item.label}`}>
            <Button
              onClick={() => {
                handleItemClick(item);
              }}
              href={item.url}
            >
              {item.label}
            </Button>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ScheduleMenu 
