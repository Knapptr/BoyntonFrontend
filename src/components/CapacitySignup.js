import { Checkbox, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import fetchWithToken from "../fetchWithToken";
import usePops from "../hooks/usePops";
import UserContext from "./UserContext";

const CapacitySignUp = ({
  weekId,
  camperSessionId,
  camperSchedule,
  camper,
  reloadCamper,
}) => {
  const auth = useContext(UserContext);
  const { PopsBar, greatSuccess, shamefulFailure } = usePops();

  const getAllEnrolledActivities = (camperSchedule) => {
    let arrayOfEnrolledActivities = [];
    const days = Object.values(camperSchedule);
    days.forEach((d) => {
      arrayOfEnrolledActivities = arrayOfEnrolledActivities.concat(
        Object.values(d)
      );
    });
    return arrayOfEnrolledActivities;
  };

  const handleEnroll = (activitySessionId, activityName) => async () => {
    const campers = [{ sessionId: camperSessionId }];
    const url = `/api/activity-sessions/${activitySessionId}/campers`;
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ campers }),
    };

    const response = await fetchWithToken(url, options, auth);
    if (response.ok) {
      const data = await response.json();
      console.log({ data });
      if (data.camperActivities.length === 1) {
        greatSuccess(
          "Enrolled Successfully",
          `${camper.firstName} was enrolled in ${activityName}`
        );
      }
      reloadCamper();
    } else {
      shamefulFailure(
        "Uh Oh!",
        `There was an issue enrolling ${camper.firstName} in ${activityName}`
      );
    }
  };

  const [capacityActs, setCapacityActs] = useState([]);

  // get all activities in week with a capacity
  useEffect(() => {
    const getData = async () => {
      const url = `/api/weeks/${weekId}/activities/capacity`;
      const response = await fetchWithToken(url, {}, auth);
      if (response.status !== 200) {
        throw new Error("Error getting activity sessions for week");
      }
      const data = await response.json();
      const capacityActsOnly = data.filter((a) => a.capacity !== null);
      setCapacityActs(capacityActsOnly);
    };
    getData();
  }, [auth,weekId]);

  const renderOptions = (camperSchedule) => {
    const allCamperActs = getAllEnrolledActivities(camperSchedule);
    return capacityActs.map((ca) => {
      const camperIsRegistered = allCamperActs.some(
        (a) => a.activityId === ca.activityId
      );
      return (
        <>
          <PopsBar />
          <Box display="flex">
            <Typography variant="h5">{ca.name}</Typography>
            <Checkbox
              disabled={camperIsRegistered}
              onChange={() => {
                if (camperIsRegistered) {
                  return;
                }
                handleEnroll(ca.id, ca.name)();
              }}
              checked={camperIsRegistered}
            />
          </Box>
        </>
      );
    });
  };
  return <>{renderOptions(camperSchedule)}</>;
};
export default CapacitySignUp;
