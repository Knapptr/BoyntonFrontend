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

const AllStaffSchedule = () => {
  const auth = useContext(UserContext);
  const { weekNumber } = useParams("weekNumber");
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
  }, [weekNumber,auth]);

  useEffect(() => {
    getDayInfo();
  }, [getDayInfo]);

  return (
    <>
      <Grid container px={1} spacing={1}>
        {days.map((d) => (
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{d.name}</Typography>
            {d.periods.map((p) => (
              <>
                <Box >
              <Link href={`/schedule/attendance/${p.id}`}>
                  <Typography fontWeight="bold" color="black" bgcolor="primary.light" variant="subtitle1">Act {p.number}</Typography>
              </Link>
                      <Grid mt={0.1} px={3} container spacing={1}>
                  {p.activities.map((a) => (
                    <Grid item xs={6} md={2} >
                        <Typography color="white" bgcolor="secondary.main">{a.name}</Typography>
                    <Box px={1}>
                        <List dense >
                          {a.staff.map((s) => (
                            <>
                              <ListItem sx={{p:0.1}}>
                                <ListItemText primary={`${s.firstName} ${s.lastName[0]}.`}/>
                              </ListItem>
                            </>
                          ))}
                        </List>
                    </Box>
                    </Grid >
                  ))}
                      </Grid>
                </Box>
              </>
            ))}
          </Grid>
        ))}
      </Grid>
    </>
  );
};
export default AllStaffSchedule;
