import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import fetchWithToken from "../fetchWithToken";
import UserContext from "./UserContext";

// helper function to get period numbers
const getPeriodNumbersFromSchedule = (schedule) => {
  const min = Math.min(
    ...schedule.map((d) => Math.min(...d.periods.map((p) => p.number)))
  );
  const max = Math.max(
    ...schedule.map((d) => Math.max(...d.periods.map((p) => p.number)))
  );
  const periodRange = [];
  for (let periodNumber = min; periodNumber <= max; periodNumber++) {
    periodRange.push(periodNumber);
  }
  return periodRange;
};
const UserSessionView = ({ session }) => {
  // Define contexts
  const auth = useContext(UserContext);
  // Define states
  const [scheduleData, setScheduleData] = useState(null);
  // Define handlers
  const handleSinglePeriodAssignment =
    (staffSessionId, periodId) => async (event, value) => {
      const requestMethod = value ? "POST" : "DELETE";
      const url = `/api/periods/${periodId}/staff`;
      const requestOptions = {
        method: requestMethod,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ staffList: [{ id: staffSessionId }] }),
      };
      const result = await fetchWithToken(url, requestOptions, auth);
      if (!result.ok) {
        console.error("Something went wrong when (un)assigning period");
      }
      loadUserData();
    };

  const handleToggleAll =
    (periodNumber, weekNumber, staffSessionId, scheduleData) => async () => {
      let method = "POST";
      if (
        scheduleData.some((d) =>
          d.periods.some(
            (p) => p.onPeriodId !== null && p.number === periodNumber
          )
        )
      ) {
        method = "DELETE";
      }
      const url = `/api/weeks/${weekNumber}/periods/staff`;
      const options = {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          periodNumber,
          staffSessions: [{ id: staffSessionId }],
        }),
      };
      const result = await fetchWithToken(url, options, auth);
      if (!result.ok) {
        console.error("Something went wrong toggling on all");
        return;
      }

      loadUserData();
    };
  // get user session information on load
  const loadUserData = useCallback(async () => {
    const response = await fetchWithToken(
      `/api/staff-sessions/${session.id}`,
      {},
      auth
    );
    if (!response.ok) {
      console.error("Error getting session");
    }
    const rawResponse = await response.json();
    setScheduleData(rawResponse.schedule);
  }, [auth, session.id]);
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    session !== null && (
      <Grid container>
        <Grid item xs={2}>
          <Typography>Toggle all</Typography>
          <Stack gap={1}>
            {scheduleData &&
              getPeriodNumbersFromSchedule(scheduleData).map((pn) => (
                <Button
                  key={`toggleall-${session.id}-${pn}`}
                  variant="contained"
                  onClick={handleToggleAll(
                    pn,
                    session.weekNumber,
                    session.id,
                    scheduleData
                  )}
                >
                  {pn}
                </Button>
              ))}
          </Stack>
        </Grid>
        <Grid item xs={10}>
          <Typography>Week {session.weekNumber - 1}</Typography>
          {scheduleData && (
            <Stack flexWrap="wrap" direction="row" gap={2}>
              {scheduleData.map((day) => (
                <Card key={`schedule-${day.id}`}>
                  <CardHeader title={day.dayName} />
                  <CardContent>
                    <Stack direction="column">
                      <FormGroup>
                        {day.periods.map((period) => (
                          <FormControlLabel
                            key={`on-${period.id}`}
                            control={
                              <Checkbox
                                checked={period.onPeriodId !== null}
                                onChange={handleSinglePeriodAssignment(
                                  session.id,
                                  period.id
                                )}
                              />
                            }
                            label={period.number}
                          />
                        ))}
                      </FormGroup>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>
    )
  );
};
export default UserSessionView;
