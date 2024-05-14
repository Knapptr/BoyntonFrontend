import { useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import UserContext from "../components/UserContext";
import ReassignModal from "../components/ReassignModal";
import ActivityAttendance, {
} from "../components/ActivityAttendance";
import ActivitySelectors from "../components/ActivitySelectors";
import ReassignmentSelectionDialog from "../components/AttendanceReassignDialog";
import fetchWithToken from "../fetchWithToken";
import AttendanceSearch from "../components/AttendanceSearch";
import { Box, Button, Grid, Skeleton, Typography, Stack } from "@mui/material";
import { Helmet } from "react-helmet";

// rate at which to update
const refreshRate = 1000 * 2;
// 8 Minutes after last user input, cancel updates
const cancelIntervalTime = 1000 * 60 * 8;

  
const AttendanceDisplay = () => {
  const abortControllerRef = useRef(null);
  const { periodId } = useParams();
  const auth = useContext(UserContext);
  const [selected, setSelected] = useState(null);
  const [selectedCampers, setSelectedCampers] = useState([]);
  const [displayAll, setDisplayAll] = useState(true);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [period, setPeriod] = useState(undefined);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const getPeriod = useCallback(async () => {
    abortControllerRef.current = new AbortController();
    const {signal} = abortControllerRef.current;
    const url = `/api/periods/${periodId}`;
    const data = await fetchWithToken(url, {signal}, auth);
    // console.log({data});
    if(data.ok){
    const periodJson = await data.json();
    setPeriod(periodJson);
    }else{
      console.log("Error avoided")
    }
  }, [periodId, auth]);

  /** Load period on page load. Handle clean up of recurring stuff / fetches **/
  useEffect(() => {
    getPeriod()
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
      abortControllerRef.current?.abort();
    };
  }, [getPeriod]);

  // Set period to undefined any time id changes
  useEffect(() => {
    setPeriod(undefined);
  }, [periodId]);

  // track user input and reset timer on every attendance change

  const startTimer = useCallback(() => {
    // cancel old timer
    if (intervalRef.current !== null && timeoutRef.current !== null) {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
      // make initial request
      getPeriod();
      // start new timer
      intervalRef.current = setInterval(() => {
        getPeriod();
      }, refreshRate);

      timeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current);
      }, cancelIntervalTime);
    } else {
      // make initial request
      getPeriod();
      intervalRef.current = setInterval(() => {
        getPeriod();
      }, refreshRate);

      timeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current);
      }, cancelIntervalTime);
    }
  }, [getPeriod]);

  // start timer on page load
  useEffect(()=>{
    startTimer()
    return ()=>{
    if (intervalRef.current !== null && timeoutRef.current !== null) {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }}, [startTimer])




  const openSearchModal = () => {
    setShowSearchModal(true);
  };
  const closeSearchModal = () => {
    setShowSearchModal(false);
  };
  const selectSpecific = (index) => {
    setSelected(index);
    setDisplayAll(false);
  };
  const selectAll = () => {
    setSelected(null);
    setDisplayAll(true);
  };
  const camperSelection = {
    select(camper) {
      setSelectedCampers((c) => [...c, camper]);
    },
    deselect(camper) {
      const camperIndex = selectedCampers.findIndex(
        (c) => c.sessionId === camper.sessionId
      );
      const updatedCampers = [...selectedCampers];
      updatedCampers.splice(camperIndex, 1);
      setSelectedCampers(updatedCampers);
    },
    isSelected(camper) {
      return selectedCampers.find((c) => c.sessionId === camper.sessionId);
    },
    clear() {
      setSelectedCampers([]);
    },
  };

  const countUnaccounted = (campers) => {
    return campers.reduce((acc,cv)=>acc + (cv.isPresent?0:1),0)
  }

  const totalUnaccounted = () => {
    return period.activities.reduce((acc,cv)=>acc + countUnaccounted(cv.campers),0)
  }

  const toggleHere = async (sessionId, camper) => {
    // Abort any oustanding fetch req
    abortControllerRef.current?.abort();

    // Eoger UI upates

    const updatedActivities = [...period.activities];
    const activityIndex = updatedActivities.findIndex(
      (a) => a.sessionId === sessionId
    );
    const updatedActivity = { ...updatedActivities[activityIndex] };
    const updatedCampers = [...updatedActivity.campers];
    const updatedCamperIndex = updatedCampers.findIndex(
      (c) => c.sessionId === camper.sessionId
    );
    const updatedCamper = { ...updatedCampers[updatedCamperIndex] };
    updatedCamper.isPresent = !updatedCamper.isPresent;
    updatedCampers.splice(updatedCamperIndex, 1, updatedCamper);
    updatedActivity.campers = updatedCampers;
    updatedActivities.splice(activityIndex, 1, updatedActivity);
    setPeriod((p) => ({ ...p, activities: updatedActivities }));

    // Make Request
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
      },
      body: JSON.stringify({ isPresent: !camper.isPresent }),
    };
    await fetchWithToken(
      `/api/camper-activities/${camper.activityId}/attendance`,
      options,auth
    );
    // Update UI from DB
    startTimer();
  };

  const renderAllActivities = () => {
    return period.activities.map((a, aIndex) => (
      <Grid item xs={12} sm={6} md={4} key={`act-atten-${a.sessionId}`}>
        <ActivityAttendance
          camperSelection={camperSelection}
          activity={a}
          activityIndex={aIndex}
          toggleHere={toggleHere}
        />
      </Grid>
    ));
  };

  const renderSelectedActivity = () => {
    return (
      <Grid item xs={12} sm={6} md={4} >
      <ActivityAttendance
        camperSelection={camperSelection}
        activity={period.activities[selected]}
        toggleHere={toggleHere}
      />
      </Grid>
    );
  };

  return (
    <>
    <Helmet>
    <title> {period?`Act ${period.number}`:""} Attendance</title>
    </Helmet>
  <Box pb={32} width={1}>
        {!period && (
          <Stack spacing={1} marginTop={8}>
            <Skeleton variant="rectangular" width="100%" height={40} />
            <Skeleton variant="rectangular" height={50} />
            <Skeleton variant="rectangular" height={100} />
            <Skeleton variant="rectangular" height={400} />
            <Skeleton variant="rectangular" height={400} />
            <Skeleton variant="rectangular" height={400} />
            <Skeleton variant="rectangular" height={400} />
          </Stack>
        )}
        {period && (
          <>
          <Box mt={3}>
          <Typography variant="subtitle2">Week {period.weekDisplay}</Typography>
          <Typography variant="caption">{period.weekTitle}</Typography>
          <Typography variant="h6">{period.dayName} Act {period.number}</Typography>

          </Box>

            <AttendanceSearch
              closeSearchModal={closeSearchModal}
              shouldDisplay={showSearchModal}
              period={period}
              activities={period.activities}
            />
            <Box>
              <Box my={1}>
                <ActivitySelectors
                  selectAll={selectAll}
          getTotalUnaccounted = {totalUnaccounted}
                  openSearchModal={openSearchModal}
                  selectSpecific={selectSpecific}
                  period={period}
                  displayAll={displayAll}
                  selected={selected}
                />
                <Button
                  color="success"
                  variant="contained"
                  sx={{ ml: 2 }}
                  onClick={openSearchModal}
                >
                  Search
                </Button>
              </Box>
            </Box>
          </>
        )}
    {period && period.activities.length === 0 && <Typography mt={4} fontWeight="bold">No Activities</Typography>}
        <Grid container spacing={2} justifyContent="center">
          {period && displayAll && renderAllActivities()}
          {period && !displayAll && renderSelectedActivity()}
        </Grid>
      </Box>
      <ReassignmentSelectionDialog
        selectedCampers={selectedCampers}
        camperSelection={camperSelection}
        setDisplayModal={setShowReassignModal}
        displayModal = {showReassignModal}
      />
        <ReassignModal
          selectedCampers={selectedCampers}
          show={showReassignModal && selectedCampers.length > 0}
          period={period}
          setDisplayModal={setShowReassignModal}
          updatePeriod={getPeriod}
          camperSelection={camperSelection}
        />
    </>
  );
};
export default AttendanceDisplay;
