import {
  Box,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useCallback } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";

const AllStaffSchedule = ({ weekNum }) => {
  const auth = useContext(UserContext);
  let { weekNumber } = useParams("weekNumber");
  if (weekNumber === undefined) {
    weekNumber = weekNum;
  }
  console.log({ weekNumber });
  const [days, setDays] = useState([]);

  const getDayInfo = useCallback(async () => {
    const data = await fetchWithToken(
      `api/weeks/${weekNumber}?staff=true`,
      {},
      auth
    );
    const week = await data.json();
    const { days } = week;
    setDays(days);
  }, [weekNumber, auth]);

  useEffect(() => {
    getDayInfo();
  }, [getDayInfo]);

  return (
    <Grid key={`staff-schedule-${weekNumber}`} container px={1} spacing={1}>
      {days.map((d) => (
        <Grid item xs={12} sm={12} md={6} key={`day-${d.id}`}>
          <Box position="sticky" top={58} bgcolor="secondary.main" zIndex={100}>
            <Typography variant="h6">{d.name}</Typography>
          </Box>
          {d.periods.map((p) => (
            <Box key={`period-${p.id}`}>
              <Box position="sticky" top={82} zIndex={100}>
                <Link href={`/schedule/attendance/${p.id}`}>
                  <Typography
                    fontWeight="bold"
                    color="black"
                    bgcolor="primary.light"
                    variant="subtitle1"
                  >
                    Act {p.number}
                  </Typography>
                </Link>
              </Box>
              <Grid mt={0.1} px={3} container gap={1}>
                {p.activities.map((a) => (
                  <Grid
                    item
                    xs={12}
                    md={5.8}
                    key={`activity-${a.sessionId}`}
                    border="solid"
                    borderColor="black"
                  >
                    <Typography color="white" bgcolor="secondary.main">
                      {a.name}
                    </Typography>
                    <Box px={1}>
                      <List dense>
                        {a.staff.map((s) => (
                          <ListItem sx={{ p: 0.1 }} key={`staff-${s.username}`}>
                            <ListItemText
                              primary={`${s.firstName} ${s.lastName[0]}.`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};
export default AllStaffSchedule;
