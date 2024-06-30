import { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { StaffBadge } from "../components/styled";
import { Helmet } from "react-helmet";
// import ActivityInformationDialog from "../components/ActivityDialog";
import useDialogs from "../hooks/useDialogs";
import {
  EmojiEvents,
  Leaderboard,
  PersonSearch,
  Scoreboard,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import MyWeeksTabbed from "../components/MyWeeksTabbed";

const ProfilePage = () => {
  const auth = useContext(UserContext);
  const [userData, setUserData] = useState(undefined);
  const { AllDialogs, handleDialogs } = useDialogs();

  const userBadges = () => {
    if (!userData) {
      return [];
    }
    const badges = [
      { type: "senior", has: userData.senior, label: "Senior Staff" },
      { type: "firstYear", has: userData.firstYear, label: "First Year" },
      { type: "lifeguard", has: userData.lifeguard, label: "Lifeguard" },
      { type: "ropes", has: userData.ropes, label: "Ropes Certified" },
      { type: "archery", has: userData.archery, label: "Archery Certified" },
    ];

    return badges.filter((b) => b.has);
  };

  const getUserData = useCallback(async () => {
    const url = `api/users/${auth.userData.user.username}`;
    const response = await fetchWithToken(url, {}, auth);
    return response;
  }, [auth]);

  const handleGetUser = useCallback(async () => {
    const response = await getUserData();
    if (response.status !== 200) {
      console.error("Big time error");
    }
    const userData = await response.json();
    setUserData(userData);
  }, [getUserData]);

  useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);
  return (
    <>
      <Helmet>
        <title>{auth.userData.user.username}-Boynton</title>
      </Helmet>

      <Box id="profilePage" width={1} py={2} px={1}>
        {userData && (
          <>
            <Container maxWidth="md">
              <AllDialogs />
              <Box component="header" marginBottom={4}>
                {/*
            <Typography variant="h5" textAlign="left" component="h3">
            {userData.firstName} {userData.lastName}
            </Typography>
          */}
                <Stack
                  id="badgesList"
                  direction="row"
                  spacing={1}
                  useFlexGap
                  flexWrap="wrap"
                  justifyContent="center"
                  paddingX={2}
                >
                  {userBadges().map((badge) => (
                    <StaffBadge
                      key={`badge-${userData.username}-${badge.type}`}
                      size="small"
                      variant="outlined"
                      type={badge.type}
                      label={badge.label}
                    />
                  ))}
                </Stack>
              </Box>
            </Container>
            <Grid
              container
              my={3}
              spacing={1}
              alignItems="flex-start"
              justifyContent="center"
              width={1}
            >
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  onClick={() => {
                    handleDialogs("giveaward");
                  }}
                  startIcon={<EmojiEvents />}
                >
                  Give Award
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  color="success"
                  startIcon={<Scoreboard />}
                  onClick={() => {
                    handleDialogs("awardpointsselect");
                  }}
                >
                  Award Points
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  href={process.env.REACT_APP_FL_OBS_URL}
                  startIcon={<Leaderboard />}
                  variant="contained"
                  color="info"
                  target="blank"
                  fullWidth
                >
                  Eval FL
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  href={process.env.REACT_APP_STAFF_OBS_URL}
                  target="blank"
                  startIcon={<PersonSearch />}
                  variant="contained"
                  color="secondary"
                >
                  Staff Obs.
                </Button>
              </Grid>
          <Grid item xs={12}sm={3}>
              <Box my={3} >
                <CamperSearch />
              </Box>
          </Grid>
              <Grid item xs={12} sm={12} md={7} lg={8}>
                <MyWeeksTabbed weeks={userData.sessions} />
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </>
  );
};
const CamperSearch = () => {
  const auth = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedCamper, setSelectedCamper] = useState(null);
  const [campers, setCampers] = useState([]);

  const handleChange = (e, v) => {
    setSelectedCamper(v);
    const url = `/camper/${v.id}`;
    navigate(url);
  };
  // effects
  useEffect(() => {
    const getCampers = async () => {
      const url = "/api/campers";
      const result = await fetchWithToken(url, {}, auth);
      if (!result.ok) {
        console.error("Something went wrong getting campers");
        return;
      }
      const data = await result.json();
      data.sort((a, b) => a.lastName.localeCompare(b.lastName));

      setCampers(data);
    };
    getCampers();
  }, [auth]);
  // Get Camper Info
  return (
    <>
      <Autocomplete
        onChange={handleChange}
        value={selectedCamper}
        options={campers}
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField {...params} label="Camper Search" />
        )}
      />
    </>
  );
};

// const UserSchedule = ({ sessions, user }) => {
//   const auth = useContext(UserContext);
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [currentSchedule, setCurrentSchedule] = useState(null);

//   const handleSessionSelect = (e, value) => {
//     setSelectedSession(value);
//   };

//   useEffect(() => {
//     // automatically select current session if in one
//     if (selectedSession === null) {
//       const currentSession = sessions.find((sess) => {
//         const rn = new Date();
//         const begins = new Date(sess.begins);
//         const ends = new Date(sess.ends);
//         return begins < rn && ends > rn;
//       });
//       if (currentSession) {
//         setSelectedSession(currentSession.weekNumber);
//       }
//     }
//     if (selectedSession !== null) {
//       const fetchSelected = async () => {
//         const url = `/api/users/${user.username}/schedule/${selectedSession}`;
//         const results = await fetchWithToken(url, {}, auth);
//         if (results.status !== 200 && results.status !== 304) {
//           console.log("Error handling needed profile schedule");
//           return;
//         }
//         const data = await results.json();
//         setCurrentSchedule(data);
//       };
//       fetchSelected();
//     }
//   }, [selectedSession, auth, user, sessions]);

//   const [activityDetails, setActivityDetails] = useState({
//     open: false,
//     activitySessionId: null,
//     dayName: null,
//     periodNumber: null,
//   });

//   const viewActivityDetails = (
//     activitySessionId,
//     dayName,
//     periodNumber,
//     periodId
//   ) => {
//     setActivityDetails({
//       open: true,
//       activitySessionId,
//       dayName,
//       periodNumber,
//       periodId,
//     });
//   };
//   const closeActivityDetails = () => {
//     setActivityDetails({
//       open: false,
//       activitySessionId: null,
//       dayName: null,
//       periodNumber: null,
//       periodId: null,
//     });
//   };

//   return (
//     <>
//       <ActivityInformationDialog
//         open={activityDetails.open}
//         onClose={closeActivityDetails}
//         dayName={activityDetails.dayName}
//         periodNumber={activityDetails.periodNumber}
//         activitySessionId={activityDetails.activitySessionId}
//         periodId={activityDetails.periodId}
//       />
//       <Card sx={{ paddingY: 2, paddingX: 1 }}>
//         <Typography variant="h5" component="h4">
//           My Weeks
//         </Typography>
//         <ToggleButtonGroup
//           exclusive
//           onChange={handleSessionSelect}
//           value={selectedSession}
//         >
//           {sessions.map((session) => (
//             <ToggleButton
//               key={`session-select-${session.weekNumber}}`}
//               value={session.weekNumber}
//             >
//               Week {session.weekNumber - 1}
//             </ToggleButton>
//           ))}
//         </ToggleButtonGroup>
//         {currentSchedule && (
//           <Fade in={!!currentSchedule}>
//             <Box>
//               {currentSchedule.map((day) => (
//                 <TableContainer key={`sched-day-${day.name}`} component={Paper}>
//                   <header>
//                     <Typography variant="h5" component="h6">
//                       {day.name}
//                     </Typography>
//                   </header>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         {day.periods.map((p) => (
//                           <TableCell key={`period-cell-${p.number}`}>
//                             Act {p.number}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       <TableRow>
//                         {day.periods.map((p, i) => (
//                           <TableCell key={`period-act-${i}`}>
//                             {p.activityName === "OFF" && (
//                               <Typography>off</Typography>
//                             )}
//                             {p.activityName !== "OFF" && (
//                               <Button
//                                 variant="outlined"
//                                 size="small"
//                                 onClick={() => {
//                                   viewActivityDetails(
//                                     p.activitySessionId,
//                                     day.name,
//                                     p.number,
//                                     p.id
//                                   );
//                                 }}
//                               >
//                                 {p.activityName}
//                               </Button>
//                             )}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               ))}
//             </Box>
//           </Fade>
//         )}
//       </Card>
//     </>
//   );
// };

export default ProfilePage;
