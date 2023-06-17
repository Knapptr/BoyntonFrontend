import ParkTwoToneIcon from "@mui/icons-material/ParkTwoTone";
import { useState, useContext } from "react";
import UserContext from "./UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import LOGO from "../resources/CLtransparentsmall.png"
import usePops from "../hooks/usePops";
import catchErrors from "../utils/fetchErrorHandling";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { handleUrlString } from "../fetchWithToken";

const Login = () => {
  const auth = useContext(UserContext);
  const [formInputs, setFormInputs] = useState({
    username: "",
    password: "",
  });
  const { PopsBar, shamefulFailure,clearPops } = usePops();

  const location = useLocation();
  const { cameFrom } = location.state || { cameFrom: null };
  const navigate = useNavigate();
  const handleUpdate = (e) => {
    clearPops();
    const field = e.target.name;
    const value = e.target.value;
    setFormInputs((f) => {
      return {
        ...f,
        [field]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const reqOptions = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: formInputs.username,
        password: formInputs.password,
      }),
    };
    const result = await fetch(handleUrlString("/auth/login"), reqOptions);
    const data = await catchErrors(result, (e) => {
      setFormInputs((f) => ({ ...f, password: "" }));
      shamefulFailure("SHAME!", e.message);
    });
    if (data) {
      const userData = await data.json();
      auth.logIn(userData.token, userData.user);
      navigate(cameFrom || "/");
    }
  };
  return (
    <Box maxWidth={400}>
      <form onSubmit={handleSubmit}>
        <Stack justifyContent="center" mb={4}>
    <Stack direction="row" justifyContent="center" mx={3}>
    <img alt="Camp Leslie" id="loginlogo" src={LOGO} />
    </Stack>
          <Typography
            lineHeight={0.8}
            variant="h3"
            textAlign="center"
    letterSpacing={0.01}
            fontWeight="bold"
            color="black"
          >
            boynton
          </Typography>
        </Stack>
        <Box display="flex" flexDirection="column" mx={3}>
          <Stack spacing={2}>
            <TextField
              inputProps={{
                autoCapitalize: "none",
                autoComplete: "off",
              }}
              label="username"
              name="username"
              id="usernameInput"
              onChange={handleUpdate}
              value={formInputs.username}
              autoFocus
              required
            />
            <TextField
              type="password"
              onChange={handleUpdate}
              required
              name="password"
              id="passwordInput"
              label="password"
              value={formInputs.password}
            />
            <Button type="submit" variant="contained" color="primary">
              <ParkTwoToneIcon />
              Login{" "}
            </Button>
          </Stack>
        </Box>
      </form>

      <PopsBar />
    </Box>
  );
};

export default Login;
