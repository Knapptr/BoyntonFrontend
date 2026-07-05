import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";


const PrintList = () => {
  // init contexts
  const { weekNumber } = useParams();
  const auth = useContext(UserContext);
  // init states
  const [schedule,setSchedule] = useState({});
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  // handlers

  // effects and Callbacks
  const getSchedule = useCallback(async (weekNumber) => {
    const url = `/api/weeks/${weekNumber}`;
    const response = await fetchWithToken(url, {}, auth);
    if (!response.ok) {
      console.error("Something went wrong getting schedule");
      return;
    }
    const data = await response.json();
    setSchedule(data);
  }, [auth]);

  useEffect(() => {
    getSchedule(weekNumber)
  }, [getSchedule,weekNumber]);
  // rendering
  return (
    <Box maxWidth={1}>
    <Box> </Box>
        <Stack
          mx="auto"
          spacing={2}
          maxWidth={600}
          justifyContent="center"
          alignItems="center"
          direction={{ xs: "column", md: "row" }}
        >
          <ToggleButtonGroup
            size="small"
            exclusive
            value={selectedDayIndex}
            onChange={(v)=>{setSelectedDayIndex(Number.parseInt(v.target.value))}}
          >
     {schedule.days &&
              schedule.days.map((day, dayIndex) => (
                <ToggleButton key={`day-${day.id}`} value={Number.parseInt(dayIndex)}>
                  {day.name}
                </ToggleButton>
              ))} 
            
          </ToggleButtonGroup>

    {/*
          // <ToggleButtonGroup
          //   size="small"
          //   exclusive
          //   value={selectedPeriodIndex}
          //   onChange={handleSelectPeriod}
          // >
          //   {selectedDay &&
          //     selectedDay()?.periods.map((p, pIndex) => (
          //       <ToggleButton value={pIndex} key={`period-${p.id}`}>
          //         Act {p.number}
          //       </ToggleButton>
          //     ))}
          // </ToggleButtonGroup>
          */}
        </Stack>
    <Box> 
    {schedule.days && schedule.days[selectedDayIndex].periods.map(period=><Box>
      <h1>{`Week ${weekNumber} - ${schedule.days[selectedDayIndex].name}`}</h1>
      {period.activities.map(activity=> 
        <>
        <Box mx={"auto"} maxWidth={"1000px"}>
        <Typography variant="h4">{activity.name}</Typography>
        <Typography variant="subtitle2">{activity.location}</Typography>
        <Typography variant="subtitle3">{activity.campers.length} camper(s) </Typography>
        <Stack direction={"row"} spacing={3}>{activity.staff.map(staff=><Box>{`${staff.firstName} ${staff.lastName[0]}`}</Box>)}</Stack>
        <Typography variant="subtitle1">{`${schedule.days[selectedDayIndex].name} Act ${period.number}`}</Typography>
        <TableContainer>
        <Table size={"small"}>
        <TableHead>
        <TableRow>
        <TableCell>First</TableCell>
        <TableCell>Last</TableCell>
        <TableCell>Age</TableCell>
        <TableCell>Pronouns</TableCell>
        <TableCell>Notes</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {activity.campers.map(camper=>
          <TableRow>
          <TableCell>{ `${camper.firstName}` }</TableCell>
          <TableCell>{ `${camper.lastName}`  }</TableCell>
          <TableCell>{ `${camper.age}`}</TableCell>
          <TableCell>{camper.pronouns && `${camper.pronouns}`}</TableCell>
          <TableCell>{camper.fl && "FL"}</TableCell>
          </TableRow>)}
        </TableBody>
        </Table>
        </TableContainer>
      </Box>
        <Box sx={{ '@media print': { pageBreakAfter: 'always' } }}> {/* This box will force a page break after it when printing */}
</Box>
        </> )}
      </Box>)}
    </Box>
    </Box>
  );
};


export default PrintList;
