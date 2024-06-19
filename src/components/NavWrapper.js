import { Outlet } from "react-router-dom";
import useDialogs from "../hooks/useDialogs";
import NavDrawer from "./NavDrawer";
import { Container } from "@mui/material";

const NavWrapper = () => {
  const { AllDialogs, handleDialogs } = useDialogs();

  return (
    <>
      <NavDrawer handleDialogs={handleDialogs} />

      <Container sx={{ paddingX: 0.75 }} maxWidth="xl">
        <AllDialogs />
        <Outlet />
      </Container>
    </>
  );
};

export default NavWrapper;
