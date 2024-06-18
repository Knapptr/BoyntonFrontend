import "styled-components/macro";
import {
  AppBar,
  Divider,
  Drawer,
  List,
  Toolbar,
  Button,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ParkTwoToneIcon from "@mui/icons-material/ParkTwoTone";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { isAdmin, isProgramming, isUnitHead } from "../utils/permissions";
import UserContext from "./UserContext";
import { ExpandMore } from "@mui/icons-material";

// THIS IS THE SOURCE OF THE MENU ITEM CONFIG
import menus from "../config/menus"; //
import DrawerMenu from "./DrawerMenuListItem";
import AppBarMenu from "./NavMenu";
////////////////////////////////////////////

// Consts
const drawerWidth = 240;

const createAccordionMenu = (name, items, handleDialogs, auth) => {
  return (
    <Accordion>
      <AccordionSummary
        onClick={(e) => e.stopPropagation()}
        expandIcon={<ExpandMore />}
      >
        {name}
      </AccordionSummary>
      <AccordionDetails>
        <List>
          <DrawerMenu items={items} handleDialogs={handleDialogs} auth={auth} />
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

/** Nav menu button that is not a link*/
export const NavMenuButton = ({ children, onClick }) => {
  return (
    <Button sx={{ color: "white" }} onClick={onClick}>
      {children}
    </Button>
  );
};

/** The main App Bar and Drawer*/
function NavDrawer(props) {
  const auth = useContext(UserContext);
  const { handleDialogs } = props;
  const { window } = props;
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  /** The Drawer itself*/
  const drawer = (
    <Drawer
      container={container}
      variant="temporary"
      anchor="right"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
        },
      }}
    >
      <Box onClick={handleDrawerToggle}>
        <Divider />
        {createAccordionMenu("Schedule", menus.schedule, handleDialogs, auth)}
        {createAccordionMenu("Campers", menus.campers, handleDialogs, auth)}
        {createAccordionMenu("Other", menus.other, handleDialogs, auth)}
        {isAdmin(auth) &&
          createAccordionMenu("Admin", menus.admin, handleDialogs, auth)}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: "4rem",
          }}
        >
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              auth.logOut();
            }}
          >
            Log Out
          </Button>
        </Box>
      </Box>
    </Drawer>
  );

  return (
    <>
      {/* THE TOP MENU BAR */}
      <AppBar position="sticky" component="nav">
        <Box width="100%">
          <Toolbar>
            <Stack direction="row" alignItems="center" mr="auto">
              <IconButton href="/">
                <ParkTwoToneIcon sx={{ fontSize: 40 }} />
              </IconButton>
              <Button
                href="/"
                size="large"
                sx={{
                  color: "black",
                  fontSize: "2rem",
                  padding: 0,
                }}
              >
                Boynton
              </Button>
            </Stack>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: "auto", display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <AppBarMenu
                name="Schedule"
                items={menus.schedule}
                handleDialogs={handleDialogs}
                auth={auth}
              />
              <AppBarMenu
                name="Campers"
                items={menus.campers}
                handleDialogs={handleDialogs}
                auth={auth}
              />
              <AppBarMenu
                name="Other"
                items={menus.other}
                handleDialogs={handleDialogs}
                auth={auth}
              />
              {isAdmin(auth) && (
                <AppBarMenu
                  name="Admin"
                  items={menus.admin}
                  handleDialogs={handleDialogs}
                  auth={auth}
                />
              )}

              <Button
                sx={{ marginLeft: "2rem" }}
                onClick={() => {
                  auth.logOut();
                }}
                variant="outlined"
                size="small"
                color="warning"
              >
                Log Out{" "}
              </Button>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
      <Box component="nav">
        {/* MOBILE DRAWER MENU */}
        {drawer}
      </Box>
    </>
  );
}

export default NavDrawer;
