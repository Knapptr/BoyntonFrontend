import { ArrowDropDown } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import fetchWithToken from "../fetchWithToken";
import AllStaffSchedule from "../pages/AllStaffSchedule";
import AdminThumbsAccordion from "./AdminThumbsAccordion";
import UserContext from "./UserContext";

const MyWeeksTabbed = ({ weeks }) => {
  const [currentTab, setCurrentTab] = useState(null);
  const handleChange = (e, value) => {
    setCurrentTab(value);
  };
  return (
    <Box>
      <Tabs value={currentTab} onChange={handleChange}>
        {weeks.map((week) => (
          <Tab
            label={`Week ${week.display}`}
            aria-controls={`tab-panel-${week.number}`}
            id={`tab-panel-${week.number}`}
          />
        ))}
      </Tabs>
      {currentTab !== null && <OneWeek week={weeks[currentTab]} />}
    </Box>
  );
};
const AdminWeek = ({ week }) => {
  return (
    <>
      <Grid item xs={12}>
        {week && <AdminThumbsAccordion weekNumber={week.weekNumber} />}
      </Grid>
      <Grid item xs={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDropDown />}>
            Staff Schedule
          </AccordionSummary>
          <AccordionDetails>
            <AllStaffSchedule weekNum={week.weekNumber} />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};
const StaffWeek = ({ week }) => {
  const [weekData, setWeekData] = useState(null);
  const [cabinList, setCabinList] = useState([]);
  const auth = useContext(UserContext);
  //Get Week, cabin list on mount
  useEffect(() => {
    setCabinList([]);
    setWeekData(null);
    const getWeekData = async () => {
      const url = `/api/users/${auth.userData.user.username}/schedule/${week.weekNumber}`;
      const response = await fetchWithToken(url, {}, auth);
      if (!response.ok) {
        console.error("Error getting user schedule");
        return;
      }
      const data = await response.json();
      setWeekData(data);
    };
    const getCabinList = async () => {
      const url = `api/cabin-sessions/${week.cabinSessionId}/campers`;
      const response = await fetchWithToken(url, {}, auth);
      if (!response.ok) {
        console.error("Error getting user cabin list");
        return;
      }
      const data = await response.json();
      setCabinList(data);
    };
    getWeekData();
    if (week.cabinSessionId) {
      getCabinList();
    }
  }, [week, auth]);
  const displayLocation = (location) =>{
    if(location!== null){return location};
    return "TBD";
  }
  return weekData && (
    <>
      <Grid item xs={12}>
        <Stack width={1} direction="row" flexWrap="wrap">
          {weekData.map((day) => (
            <List>
              <ListSubheader>{day.name}</ListSubheader>
              {day.periods.map((p) => (
                <ListItemButton
                  component={Link}
                  to={`/schedule/activity/${p.activitySessionId}`}
                >
                  <ListItemText
                    primary={`${p.activityName}  @ ${displayLocation(p.location)}`}
                    secondary={`Act ${p.number}`}
                  />
                </ListItemButton>
              ))}
            </List>
          ))}
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDropDown />}>{`Cabin: ${
            week.cabinAssignment || "Unassigned"
          }`}</AccordionSummary>
          <AccordionDetails>
            <List dense>
              {cabinList.map((c) => (
                <ListItemButton component={Link} to={`/camper/${c.camperId}`}>
                  <ListItemText
                    primary={`${c.firstName} ${c.lastName}`}
                    secondary={`${c.age} ${(c.dayCamp && "(day)") || ""} ${
                      (c.fl && "(FL)") || ""
                    }`}
                  />
                </ListItemButton>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};

const OneWeek = ({ week }) => {
  const auth = useContext(UserContext);

  const userType = auth.userData.user.role;
  const renderType = () => {
    switch (userType) {
      case "admin":
        return <AdminWeek week={week} />;
      default:
        return <StaffWeek week={week} />;
    }
  };
  return <Grid container>{renderType()}</Grid>
};

export default MyWeeksTabbed
