import ParkTwoToneIcon from "@mui/icons-material/ParkTwoTone";
import { useState} from "react";
import LOGO from "../resources/CLtransparentsmall.png"
import usePops from "../hooks/usePops";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const [formInputs, setFormInputs] = useState({
    username: "",
    password: "",
  });
  const { PopsBar, shamefulFailure,clearPops } = usePops();

  const {login} = useLogin({onErr:(e)=>{ shamefulFailure("SHAME!", e.message)},onSubmit: ()=>{
    setFormInputs((f)=>({...f,password:""}))
  }})

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
    const data = {username:formInputs.username,password:formInputs.password}
    login(data)
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
