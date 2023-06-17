import { Close, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import fetchWithToken from "../fetchWithToken";
import UserContext from "./UserContext";

const ActivityInformationDialog = ({
  open,
  onClose,
  activitySessionId,
  dayName,
  periodNumber,
  periodId,
}) => {
  const auth = useContext(UserContext);
  const [activityData, setActivityData] = useState(null);
  useEffect(() => {
    const getActivityData = async () => {
      const url = `/api/activity-sessions/${activitySessionId}`;
      try {
        const response = await fetchWithToken(url, {}, auth);
        if (response.ok) {
          const data = await response.json();
          setActivityData(data);
        }
        // This will need to get error handling TODO
      } catch (e) {
        console.log({ e });
      }
    };
    if (activitySessionId !== null) {
      getActivityData();
    }
  }, [activitySessionId]);
  return (
    <Dialog fullScreen open={open} onClose={onClose} fullWidth>
      <DialogActions>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogActions>
      {activityData !== null && (
        <>
          <DialogTitle component="div" variant="subtitle1">
            <Typography variant="h4" color="primary">
              {dayName} Act {periodNumber}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <Card
                  sx={{ backgroundColor: "secondary.main", color: "white" }}
                >
                  <CardContent>
                    <Typography variant="h6">{activityData.name}</Typography>
                    <Typography variant="body1">
                      {activityData.description}
                    </Typography>
                  </CardContent>
        <CardActions>
        <Button href={`/schedule/attendance/${periodId}`}variant="contained">Take Attendance</Button>
        </CardActions>
                </Card>
                <Stack></Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                  }}
                >
                  <Box
                    bgcolor="primary.main"
                    zIndex={100}
                    pt={2}
                    px={2}
                    position="sticky"
                    top={0}
                  >
                    <Typography variant="h6">
                      {activityData.campers.length} Campers
                    </Typography>
                    <Divider />
                  </Box>
                  <CardContent>
                    <Stack justifyContent="center">
                      <Stack
                        spacing={0.5}
                        justifyContent="center"
                        width={1 / 2}
        mx="auto"
                      >
                        {activityData.campers.map((camper) => (
                          <Chip
                            color="secondary"
                            size="small"
                            label={`${camper.firstName} ${camper.lastName}`}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default ActivityInformationDialog;
