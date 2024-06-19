import { useCallback, useContext, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box, Card, Fab, Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Typography
} from "@mui/material";
import useWeeks from "../hooks/useWeeks";
import AddScoreDialog from "../components/AddScoreDialog";

export const ScoreBoard = () => {
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
            Scoreboard
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
            week={selectedWeek()} />
          {scores && (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Week </TableCell>
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
