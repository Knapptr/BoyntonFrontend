import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import useDownloadLink from "../hooks/useGetDownloadLink";
import prepareRoleMenuItems from "../utils/filterRoles";
import { NavMenuButton } from "./NavDrawer";

const AppBarMenu = ({ name, items, handleDialogs, auth }) => {
  const [download] = useDownloadLink();
  const [anchorEl, setAnchorEl] = useState(null);
  const authBasedItems = prepareRoleMenuItems(items, auth);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const renderItem = (item) => {
    switch (item.type) {
      case "link":
        return (
          <MenuItem key={`menuItem-${item.label}`}>
            <Button startIcon={item.icon && item.icon} href={item.href} onClick={handleClose}>
              {item.label}{" "}
            </Button>
          </MenuItem>
        );
      case "dialog":
        return (
          <MenuItem key={`menuItem-${item.label}`}>
            <Button
          startIcon={item.icon && item.icon}
              onClick={() => {
                handleDialogs(item.dialog);
                handleClose();
              }}
            >
              {" "}
              {item.label}{" "}
            </Button>
          </MenuItem>
        );
      case "download":
        return (
          <MenuItem key={`menuItem-${item.label}`}>
            <Button
          startIcon={item.icon && item.icon}
              onClick={() => {
                download(item.href, item.filename);
                handleClose();
              }}
            >
              {" "}
              {item.label}{" "}
            </Button>
          </MenuItem>
        );
    }
  };
  return (
    <>
      <NavMenuButton onClick={handleMenu}>
        <Typography>{name}</Typography>
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
        {authBasedItems.map((item) => renderItem(item))}
      </Menu>
    </>
  );
};

export default AppBarMenu
