import ParkTwoTone from "@mui/icons-material/ParkTwoTone";
import {
  Button,
  Container,
  Box,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  FormControl,
} from "@mui/material";
import { clear } from "@testing-library/user-event/dist/clear";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWithoutToken } from "../fetchWithToken";
import useLogin from "../hooks/useLogin";
import usePops from "../hooks/usePops";
import LOGO from "../resources/CLtransparentsmall.png";

const weekSelections = [
  { label: "Taste Of Camp", number: 1 },
  { label: "Week 1", number: 2 },
  { label: "Week 2", number: 3 },
  { label: "Week 3", number: 4 },
  { label: "Week 4", number: 5 },
  { label: "Week 5", number: 6 },
  { label: "Week 6", number: 7 },
];

const badgeSelections = [
  { label: "Archery Certified", name: "archery" },
  { label: "Ropes Certified", name: "ropes" },
  { label: "Lifeguard", name: "lifeguard" },
  { label: "First Year on Staff", name: "firstYear" },
  { label: "Senior Staff", name: "senior" },
];

const CreateUserPage = () => {
  const {signUpToken} = useParams()
  const {login} = useLogin({
    onErr: (e)=>{console.log("there was an error:");console.log(e)},
  })
  const { PopsBar,shamefulFailure,clearPops } = usePops();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearPops();
    const {confirmPassword,username,sessions, password,...everythingElse} = formInputs;
    if(password !== confirmPassword){
        shamefulFailure("SHAME","Passwords must match")
      return;
    }
    const url = `/auth/create/${signUpToken}`

    console.log({sessions});
    const data = {
      users: [{
        username,
        password, 
        sessions: sessions.map(n=>({weekNumber:n})),
        ...everythingElse, 
      }]
    }
    const options = {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    }
      const response = await fetchWithoutToken(url,options);
      const responseData = await response.json();
    // if a username is sent back, good to go, log user in
      console.log({responseData});
    if(responseData[0].username){
      login({username:username,password})  
    }else{
      responseData.forEach(m=>shamefulFailure("SHAME",m.msg))
    }
  };

  const handleChange = (e, value) => {
    clearPops();
    if (e.target.type === "checkbox") {
      setFormInputs((f) => ({ ...f, [e.target.name]: value }));
    } else {
      setFormInputs((f) => ({ ...f, [e.target.name]: e.target.value }));
    }
  };

  const handleSessionChange = (e) =>{
    const weekNumber = Number.parseInt(e.target.name)
    let sessions = [...formInputs.sessions]
      setFormInputs((f)=>{
        if(sessions.includes(weekNumber)){
          sessions = sessions.filter(s=>s!==weekNumber)
        }else{
          sessions.push(weekNumber)
        }
        return {...f,sessions}
      })
  }
  
  const [formInputs, setFormInputs] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    lifeguard: false,
    ropes: false,
    archery: false,
    firstYear: false,
    senior: false,
    sessions: []
  });

  return (
    <>
      <Box my={4} mx="auto" maxWidth={400}>
        <form onSubmit={handleSubmit}>
          <Stack justifyContent="center" mb={4}>
            <Container>
              <Stack direction="row" spacing={4} alignItems="center">
                <img width={100} alt="Camp Leslie" id="loginlogo" src={LOGO} />

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
            </Container>
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
                onChange={handleChange}
                value={formInputs.username}
                autoFocus
                required
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  size="small"
                  label="first name"
                  name="firstName"
                  onChange={handleChange}
                  value={formInputs.firstName}
                  required
                />
                <TextField
                  size="small"
                  label="last name"
                  name="lastName"
                  onChange={handleChange}
                  value={formInputs.lastName}
                  required
                />
              </Stack>
              <TextField
                size="small"
                type="password"
                onChange={handleChange}
                required
                name="password"
                label="password"
                value={formInputs.password}
              />
              <TextField
                size="small"
                type="password"
                onChange={handleChange}
                required
                name="confirmPassword"
                label="confirm password"
                value={formInputs.confirmPassword}
              />

              <Typography variant="subtitle1" color="primary">
                Weeks you will be at camp
              </Typography>
              <Divider />
              <FormControl>
                {weekSelections.map((selection) => (
                  <FormControlLabel
                    key={`week-${selection.number}`}
                    checked={formInputs[selection.number]}
                    onChange={handleSessionChange}
                    name={selection.number}
                    control={<Checkbox />}
                    label={selection.label}
                  />
                ))}
              </FormControl>
              <Typography variant="subtitle1" color="primary">
                Check all that apply to you
              </Typography>
              <Divider />
              <FormControl>
                {badgeSelections.map((badge) => (
                  <FormControlLabel
                    key={`badge-${badge.name}`}
                    checked={formInputs[badge.name]}
                    onChange={handleChange}
                    name={badge.name}
                    label={badge.label}
                    control={<Checkbox />}
                  />
                ))}
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                <ParkTwoTone />
                Sign Up
              </Button>
            </Stack>
          </Box>
        </form>

        <PopsBar />
      </Box>
    </>
  );
};

export default CreateUserPage;
