import { Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import fetchWithToken from "../fetchWithToken";
import UserContext from "./UserContext";
import { DailyScheduleAccordion } from "./Schedule";

export const DailySchedules = () => {
  const auth = useContext(UserContext);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const getSchedule = async () => {
      const url = "/api/schedule";
      const response = await fetchWithToken(url, {}, auth);
      const data = await response.json();
      console.log({ data });
      setSchedule(data);
    };
    getSchedule();
  }, [auth]);
  const [expanded, setExpanded] = useState("none");

  const handleExpand = (name) => (e, toggleValue) => {
    console.log("handle expand");
    console.log(name);
    if (toggleValue) {
      setExpanded(name);
    } else {
      setExpanded("none");
    }
  };

  return (
    <>
      {schedule && (
        <>
          <Stack spacing={1}>
            <DailyScheduleAccordion
              onExpand={handleExpand("normal")}
              expanded={expanded === "normal"}
              name="M-Th"
              schedule={schedule.normal} />
            <DailyScheduleAccordion
              onExpand={handleExpand("friday")}
              expanded={expanded === "friday"}
              name="Friday"
              schedule={schedule.friday} />
            <DailyScheduleAccordion
              onExpand={handleExpand("lateFriday")}
              expanded={expanded === "lateFriday"}
              name="Late Friday"
              schedule={schedule.lateFriday} />
            <DailyScheduleAccordion
              onExpand={handleExpand("sunday")}
              expanded={expanded === "sunday"}
              name="Sunday"
              schedule={schedule.sunday} />
          </Stack>
        </>
      )}
    </>
  );
};
