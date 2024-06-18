import useActivityAttendance from "../hooks/useActivityAttendance";
import { useContext, useState } from "react";
import lodash from "lodash";
import { postCampersToActivity } from "../requests/activity";
import toTitleCase from "../toTitleCase";
import UserContext from "./UserContext";
import {
  Box,
  Container,
  Chip,
  Drawer,
  Grid,
  Skeleton,
  Stack,
  styled,
  Typography,
  Alert,
  Tooltip,
  IconButton,
  ClickAwayListener,
} from "@mui/material";
import usePops from "../hooks/usePops";
import { HelpOutlined, LiveHelpRounded } from "@mui/icons-material";

const drawerWidth = 175;

const ActivityList = styled(Box)(({ bg, theme }) => ({
  backgroundColor: bg
    ? theme.palette.background[bg]
    : theme.palette.background.secondary,
  borderRadius: "2%",
}));
const ActivityListing = ({
  activity,
  handleSubmit,
  dropZoneSize,
  handleSelectCamper,
  selectedCampers,
  cabinName,
}) => {
  const [showDescription,setShowDescripton] = useState(false);
  const handleToggleDescription=(e)=>{
    e.stopPropagation();
    setShowDescripton(s=>!s);
  }
  const handleDescriptionClose=()=>{setShowDescripton(false)}
  return <ActivityList
    bg={activity.capacity !== null ? "disabled" : "secondary"}
    key={`activity-list-${activity.id}`}
    px={1}
    width={1}
    onClick={() => {
      activity.capacity === null && handleSubmit(activity.id);
    }}
  >
    <Box component="header" mb={1}>
      <Typography fontWeight="bold" variant="subtitle1">
        {toTitleCase(activity.name)}
  <ClickAwayListener onClickAway={handleDescriptionClose} >
        <Tooltip open={showDescription} title={<Typography variant="subtitle2">{activity.description}</Typography>}>
          <IconButton onClick={handleToggleDescription}>
    {showDescription?<LiveHelpRounded/>:<HelpOutlined />}
          </IconButton>
        </Tooltip>
    </ClickAwayListener>
      </Typography>
    </Box>
    {/* Alphabetize here, so that ui updates are consistant*/}
    <Container maxWidth="sm">
      <Stack spacing={1}>
        {[...activity.campers]
          .sort((a, b) => a.lastName.localeCompare(b.lastName))
          .filter((c) => c.cabin === cabinName)
          //only show current cabin
          .map((camper) => (
            <Chip
              key={`activity-${activity.id}-${camper.sessionId}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectCamper(camper, activity.id);
              }}
              color={
                selectedCampers.some(
                  (sc) => sc.camper.sessionId === camper.sessionId
                )
                  ? "primary"
                  : "default"
              }
              label={`${camper.firstName} ${camper.lastName}`}
            />
          ))}
      </Stack>
    </Container>
    <Box id={`${activity.id}-dropzone`} py={dropZoneSize(activity.id)}></Box>
  </ActivityList>;
};

const SelectActivities = ({
  period,
  cabinName,
  selectedCampers,
  handleSelectCamper,
  clearSelection,
}) => {
  const auth = useContext(UserContext);
  const { PopsBar, shamefulFailure } = usePops();
  const {
    loading: activitiesLoading,
    activityLists,
    setLists,
    refresh,
  } = useActivityAttendance(period.id, cabinName);

  const handleSubmit = async (activitySessionId) => {
    if (
      selectedCampers.length > 0 &&
      selectedCampers.some((c) => c.sourceId !== activitySessionId)
    ) {
      const campersToAdd = [...selectedCampers];
      // Eagerly update UI
      let newState = lodash.cloneDeep(activityLists);
      for (const selectedCamper of campersToAdd) {
        // Remove camper from source
        newState[selectedCamper.sourceId].campers = newState[
          selectedCamper.sourceId
        ].campers.filter(
          (c) => c.sessionId !== selectedCamper.camper.sessionId
        );
        // Add camper to destination
        newState[activitySessionId].campers.push(selectedCamper.camper);
      }
      // update state
      clearSelection();
      setLists({ ...newState });
      // Send post request and then refresh data
      try {
        await postCampersToActivity(
          campersToAdd.map((c) => c.camper),
          activitySessionId,
          auth
        );
        refresh();
      } catch (e) {
        console.log("Something went wrong assigning campers to db", e);
        // Alert the user somehow usepops()?
        shamefulFailure(
          "Connection Error",
          "Your last request didn't go through. Check your connection and try again. If it persists, notify an administrator"
        );
        // Try and refresh-  but it may fail
        refresh();
      }
    }
    // refresh from db
  };
  const dropZoneSize = (activityId) => {
    switch (activityLists[activityId].campers.length) {
      case 0:
        return 4;
      case 1:
        return 2;
      case 2:
        return 1;
      default:
        return 0;
    }
  };

  return (
    <>
      <PopsBar />
      <Box width={1} display="flex">
        {/* CAMPERS */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            zIndex: 0,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Box mb={20} />
          {activityLists.unassigned &&
            activityLists.unassigned.campers.length === 0 && (
              <Box px={0.75}>
                <Alert severity="success" variant="filled">
                  All Campers Assigned!
                </Alert>
              </Box>
            )}
          {activityLists.unassigned &&
            activityLists.unassigned.campers.length > 0 && (
              <Box px={0.75}>
                <Box position="sticky" top={0} component="header">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Unassigned
                  </Typography>
                </Box>
                <Stack direction="column" spacing={1}>
                  {activityLists.unassigned &&
                    [...activityLists.unassigned.campers]
                      .sort((a, b) => a.lastName.localeCompare(b.lastName))
                      .map((camper, index) => (
                        <Chip
                          key={`camper-unassigned-${camper.sessionId}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCamper(camper, "unassigned");
                          }}
                          color={
                            selectedCampers.some(
                              (sc) => sc.camper.sessionId === camper.sessionId
                            )
                              ? "primary"
                              : "default"
                          }
                          label={`${camper.firstName} ${camper.lastName} ${camper.age}`}
                        />
                      ))}
                </Stack>
              </Box>
            )}
        </Drawer>
        <Grid container justifyContent="center">
          {activitiesLoading ? (
            <Box>
              <Skeleton
                animation="wave"
                variant="rectangular"
                height={400}
                width={350}
              />
              <Skeleton
                animation="wave"
                variant="rectangular"
                height={400}
                width={350}
              />
            </Box>
          ) : (
            <>
              {/* ACTIVITIES */}

              <Stack
                width={1}
                maxWidth={666}
                spacing={2}
                pl={0.33}
                alignItems="stretch"
                py={1}
              >
                {period.allWeek && (
                  <Typography variant="h6" bgcolor="primary.main" color="white">
                    All Week Activity
                  </Typography>
                )}
                {activityLists.activityIds &&
                  activityLists.activityIds.map((aid, index) => (
                    <ActivityListing
                      activity={activityLists[aid]}
                      handleSelectCamper={handleSelectCamper}
                      selectedCampers={selectedCampers}
                      handleSubmit={handleSubmit}
                      dropZoneSize={dropZoneSize}
                      cabinName={cabinName}
                    />
                  ))}
              </Stack>
              {/*
              )*/}
            </>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default SelectActivities;
