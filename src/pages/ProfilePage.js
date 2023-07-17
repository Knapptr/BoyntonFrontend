import { useCallback, useContext, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  Fade,
  FormControl,
  Grid,
  Link,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { StaffBadge } from "../components/styled";
import useWeeks from "../hooks/useWeeks";
import { Helmet } from "react-helmet";
import ActivityInformationDialog from "../components/ActivityDialog";
import DailySchedules from "../components/Schedule";
import useDownloadLink from "../hooks/useGetDownloadLink";
import { isProgramming, isUnitHead } from "../utils/permissions";

const AddScoreDialog = ({ onClose, show, week }) => {
  const TEAMS = ["Naumkeag", "Tahattawan"];
  const auth = useContext(UserContext);

  const fetchAddPoints = async () => {
    const reqBody = { ...fields, weekNumber: week.number };
    const url = "/api/scores";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    };
    const response = await fetchWithToken(url, options, auth);
    await response.json();
  };

  const handleSubmit = async () => {
    await fetchAddPoints();
    handleClose();
  };

  const initFields = { awardedFor: "", awardedTo: TEAMS[0], points: 0 };
  const [fields, setFields] = useState(initFields);

  const handleChange = (e) => {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const allFieldsFilled = () => {
    return (
      fields.awardedFor.trim().length > 0 &&
      fields.points > 0 &&
      fields.awardedTo.trim().length > 0
    );
  };
  const handleClose = () => {
    onClose();
    setFields(initFields);
  };

  return (
    week && (
      <Dialog onClose={handleClose} open={show}>
        <DialogTitle>Award Points: Week {week.display}</DialogTitle>
        <DialogContent>
          <Box component="form" autoComplete="off">
            <FormControl>
              <Stack direction="row" paddingY={2} gap={2}>
                <TextField
                  sx={{
                    minWidth: "10rem",
                  }}
                  value={fields.awardedTo}
                  onChange={handleChange}
                  name="awardedTo"
                  id="outlined-basic"
                  label="Team"
                  variant="outlined"
                  select
                >
                  {TEAMS.map((team) => (
                    <MenuItem value={team} key={`team-select-${team}`}>
                      {team}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  name="points"
                  value={fields.points}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                  id="outlined-basic"
                  label="Points"
                  type="number"
                  variant="outlined"
                />
              </Stack>
              <Box width={1}>
                <TextField
                  name="awardedFor"
                  value={fields.awardedFor}
                  onChange={handleChange}
                  id="outlined-basic"
                  label="Reason"
                  variant="outlined"
                />
              </Box>
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="space-around" marginY={2}>
            <Button variant="outlined" color="warning" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              enabled={allFieldsFilled() ? "false" : undefined}
              onClick={() => {
                if (allFieldsFilled()) {
                  handleSubmit();
                }
              }}
            >
              Score!
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    )
  );
};
const ScorePane = () => {
  const auth = useContext(UserContext);
  const [scores, setScores] = useState(null);
  const { selectedWeek, WeekSelection } = useWeeks();

  const getScore = useCallback(
    async (weekNumber) => {
      const url = `/api/weeks/${weekNumber}/scores`;
      const scoresResp = await fetchWithToken(url, {}, auth);
      const data = await scoresResp.json();
      setScores(data);
    },
    [auth]
  );

  useEffect(() => {
    if (selectedWeek()) {
      getScore(selectedWeek().number);
    }
  }, [selectedWeek, getScore]);

  const scoreRows = () => {
    if (!scores) {
      return false;
    }
    const teams = scores.summerTotals.map((d) => d.team);
    const data = teams.map((team) => {
      const summerCol = scores.summerTotals.find((d) => d.team === team);
      const summerTotal = (summerCol && summerCol.total) || 0;

      const weekCol = scores.weekTotals.find((d) => d.team === team);
      const weekTotal = (weekCol && weekCol.total) || 0;
      return {
        team: team,
        summerTotal,
        weekTotal,
      };
    });
    return data;
  };

  const [showAdd, setShowAdd] = useState(false);
  const handleOpen = () => {
    setShowAdd(true);
  };
  const handleClose = () => {
    setShowAdd(false);
  };
  return (
    <>
      <Box>
        <Card>
          <Typography variant="h5" component="h4">
            2023 Scoreboard
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            paddingX={2}
            marginBottom={1}
          >
            <WeekSelection />
            <Fab
              size="small"
              color="success"
              sx={{ marginLeft: "2rem" }}
              disabled={!selectedWeek()}
              onClick={selectedWeek() && handleOpen}
            >
              <AddIcon />
            </Fab>
          </Stack>
          <AddScoreDialog
            show={showAdd}
            onClose={() => {
              getScore(selectedWeek().number);
              handleClose();
            }}
            week={selectedWeek()}
          />
          {scores && (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Week {}</TableCell>
                      <TableCell align="right">All Summer</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scoreRows().map((row) => (
                      <TableRow key={`team-row-${row.team}`}>
                        <TableCell component="th" scope="row">
                          {row.team}
                        </TableCell>
                        <TableCell align="right">{row.weekTotal}</TableCell>
                        <TableCell align="right">{row.summerTotal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Week Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Team</TableCell>
                          <TableCell>Points</TableCell>
                          <TableCell>Day</TableCell>
                          <TableCell>Reason</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scores.events.map((event, index) => (
                          <TableRow key={`event-${index}`}>
                            <TableCell>{event.team}</TableCell>
                            <TableCell>{event.points}</TableCell>
                            <TableCell>
                              <Typography variant="caption" component={"span"}>
                                {event.day}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" component={"span"}>
                                {event.for}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </Card>
      </Box>
    </>
  );
};
const ProfilePage = () => {
  const auth = useContext(UserContext);
  const [userData, setUserData] = useState(undefined);
  const [download] = useDownloadLink();

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
              <Box component="header" marginBottom={4}>
                <Card sx={{ paddingBottom: 1 }} elevation={4}>
                  <CardContent>
                    <Box marginBottom={1}>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        textAlign="left"
                        component="h3"
                      >
                        {userData.username}
                      </Typography>
                      <Typography variant="h5" textAlign="left" component="h3">
                        {userData.firstName} {userData.lastName}
                      </Typography>
                    </Box>
                    <Divider color="secondary" sx={{ marginY: 1 }} />
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
                  </CardContent>
                </Card>
              </Box>
            </Container>
            <Grid
              container
              spacing={{ xs: 2, sm: 1, md: 2, lg: 3 }}
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={7} lg={8}>
                <Stack spacing={1}>
                  <Card>
                    <CardHeader title="Resources" />
                    <CardContent>
                      <Stack>
                            <Link href={`${process.env.REACT_APP_FL_OBS_URL}`}>
                              FL Observation
                            </Link>
                            <Link href={`${process.env.REACT_APP_FL_CABIN_OBS_URL}`}>
          Cabin Counselor FL Eval
                            </Link>
          { isUnitHead(auth) && <Link 
            href={process.env.REACT_APP_OBSERVATION_RESPONSES_URL}
          >Staff Observation Responses</Link>}
          { isProgramming(auth) && <Link
                              href={`${process.env.REACT_APP_STAFF_OBS_URL}`}
                            >
                              Staff Observation
                            </Link>}
                            <Link
                              onClick={() => {
                                download(
                                  `/docs/counselor-handbook`,
                                  "counselor-handbook2023.pdf"
                                );
                              }}
                            >
                              Counselor Handbook
                            </Link>
                      </Stack>
                    </CardContent>
                  </Card>
                  <UserSchedule user={userData} sessions={userData.sessions} />

                </Stack>
              </Grid>
              <Grid item xs={12} sm={12} md={5} lg={4}>
                <Stack spacing={2}>
                  <ScorePane />
                  <Paper sx={{ py: 2, px: 1 }}>
                    <Typography variant="h5">Daily Schedule</Typography>
                    <DailySchedules />
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </>
  );
};

const UserSchedule = ({ sessions, user }) => {
  const auth = useContext(UserContext);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState(null);

  const handleSessionSelect = (e, value) => {
    setSelectedSession(value);
  };

  useEffect(() => {
    // automatically select current session if in one
    if (selectedSession === null) {
      const currentSession = sessions.find((sess) => {
        const rn = new Date();
        const begins = new Date(sess.begins);
        const ends = new Date(sess.ends);
        return begins < rn && ends > rn;
      });
      if (currentSession) {
        setSelectedSession(currentSession.weekNumber);
      }
    }
    if (selectedSession !== null) {
      const fetchSelected = async () => {
        const url = `/api/users/${user.username}/schedule/${selectedSession}`;
        const results = await fetchWithToken(url, {}, auth);
        if (results.status !== 200 && results.status !== 304) {
          console.log("Error handling needed profile schedule");
          return;
        }
        const data = await results.json();
        setCurrentSchedule(data);
      };
      fetchSelected();
    }
  }, [selectedSession, auth, user, sessions]);

  const [activityDetails, setActivityDetails] = useState({
    open: false,
    activitySessionId: null,
    dayName: null,
    periodNumber: null,
  });

  const viewActivityDetails = (
    activitySessionId,
    dayName,
    periodNumber,
    periodId
  ) => {
    setActivityDetails({
      open: true,
      activitySessionId,
      dayName,
      periodNumber,
      periodId,
    });
  };
  const closeActivityDetails = () => {
    setActivityDetails({
      open: false,
      activitySessionId: null,
      dayName: null,
      periodNumber: null,
      periodId: null,
    });
  };

  return (
    <>
      <ActivityInformationDialog
        open={activityDetails.open}
        onClose={closeActivityDetails}
        dayName={activityDetails.dayName}
        periodNumber={activityDetails.periodNumber}
        activitySessionId={activityDetails.activitySessionId}
        periodId={activityDetails.periodId}
      />
      <Card sx={{ paddingY: 2, paddingX: 1 }}>
        <Typography variant="h5" component="h4">
          My Schedule
        </Typography>
        <ToggleButtonGroup
          exclusive
          onChange={handleSessionSelect}
          value={selectedSession}
        >
          {sessions.map((session) => (
            <ToggleButton
              key={`session-select-${session.weekNumber}}`}
              value={session.weekNumber}
            >
              Week {session.weekNumber}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {currentSchedule && (
          <Fade in={!!currentSchedule}>
            <Box>
              {currentSchedule.map((day) => (
                <TableContainer key={`sched-day-${day.name}`} component={Paper}>
                  <header>
                    <Typography variant="h5" component="h6">
                      {day.name}
                    </Typography>
                  </header>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {day.periods.map((p) => (
                          <TableCell key={`period-cell-${p.number}`}>
                            Act {p.number}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {day.periods.map((p, i) => (
                          <TableCell key={`period-act-${i}`}>
                            {p.activityName === "OFF" && (
                              <Typography>off</Typography>
                            )}
                            {p.activityName !== "OFF" && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  viewActivityDetails(
                                    p.activitySessionId,
                                    day.name,
                                    p.number,
                                    p.id
                                  );
                                }}
                              >
                                {p.activityName}
                              </Button>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ))}
            </Box>
          </Fade>
        )}
      </Card>
    </>
  );
};

export default ProfilePage;
