import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";

const ActivityInfo = () => {
  const auth = useContext(UserContext);
  const { activityId } = useParams();
  const [activity, setActivity] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const getActivity = async (id) => {
      const url = `api/activity-sessions/${id}`;
      const response = await fetchWithToken(url, {}, auth);
      // handle no response
      if (response.status !== 200) {
        const text = await response.text()
        setError(text);
      } else {
        const data = await response.json();
        console.log({ data });
        setActivity(data);
      }
    };
    getActivity(activityId);
  }, [auth,activityId]);

  return (
    ((error && <h1>{error}</h1>) || (!activity && <h1>Loading</h1>)) ||
    (
      <Box>
        <Card>
          <CardContent>
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
              <Box maxWidth={{ xs: 1, sm: 0.5 }}>
                <Stack spacing={1}>
                  <Box>
                    <Typography color="gray" variant="subtitle1">
                      Week {activity.weekDisplay} - {activity.dayName} Act{" "}
                      {activity.periodNumber}
                    </Typography>
                  </Box>
                  <Typography variant="h5">{activity.name}</Typography>
                  <Typography variant="body1">
                    {activity.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    to={`/schedule/attendance/${activity.periodId}`}
                  >
                    Take Attendance
                  </Button>
                </Stack>
              </Box>
              <Divider flexItem orientation="vertical" />
              <Box>
                <Stack direction="column">
                  <Box>
                    <Typography>Staff</Typography>
                    <List disablePadding dense>
                      {activity.staff.map((staff) => {
                        return (
                          <ListItem>
                            <ListItemText
                              primary={staff.firstName}
                              secondary={staff.lastName}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                  <Divider flexItem />
                  <Box>
                    <Typography>Campers</Typography>
                    <Typography>{activity.campers.length} campers</Typography>
                    <List disablePadding dense>
                      {activity.campers.map((camper) => {
                        return (
                          <ListItem>
                            <ListItemButton
                              component={Link}
                              to={`/camper/${camper.camperId}`}
                            >
                              <ListItemText
                                primary={`${camper.firstName} ${camper.lastName}`}
                                secondary={`${camper.age} - Cabin ${camper.cabin}`}
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    )
  );
};

export default ActivityInfo;
