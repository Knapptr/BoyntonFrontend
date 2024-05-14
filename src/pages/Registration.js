import {
  AddCircle,
  CabinRounded,
  CreateRounded,
  Expand,
  ExpandMore,
  School,
  WbSunny,
} from "@mui/icons-material";
import {
  Box,
  Stack,
  Autocomplete,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ClickAwayListener,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CapacitySignUp from "../components/CapacitySignup";
import CommentBox from "../components/CommentBox";
import CommentDialog from "../components/CommentDialog";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";

export const RegistrationIndex = () => {
  return <h1>Registration / </h1>;
};

const CamperSearchBar = ({ campers, handleSelect, selected }) => {
  const options = campers.map((c) => ({
    label: `${c.firstName} ${c.lastName}`,
    id: c.id,
  }));
  return (
    <Autocomplete
      onChange={handleSelect}
      value={selected}
      options={options}
      renderInput={(params) => <TextField {...params} label="Camper Search" />}
      isOptionEqualToValue={(op, value) => op.id === value.id}
    />
  );
};

const CamperDetails = ({ camperId, weekId }) => {
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const auth = useContext(UserContext);
  const [camper, setData] = useState(null);

  const toggleCommentDialog = () => {
    setShowCommentDialog((s) => !s);
  };

  const onCommentPush = () => {
    setShowCommentDialog(false);
    loadData();
  };
  const loadData = useCallback(async () => {
    const url = `/api/campers/${camperId}`;
    const response = await fetchWithToken(url, {}, auth);
    if (!response.ok) {
      throw new Error("Error getting camper data");
    } else {
      const camperInfo = await response.json();
      const currentWeekInfo = camperInfo.weeks.find(
        (s) => s.weekNumber === weekId
      );
      const camper = {
        firstName: camperInfo.firstName,
        lastName: camperInfo.lastName,
        age: camperInfo.age,
        pronouns: camperInfo.pronouns,
        comments: camperInfo.comments,
        id: camperInfo.id,
        session: {
          id: currentWeekInfo.id,
          weekNumber: currentWeekInfo.weekNumber,
          cabin: currentWeekInfo.cabin,
          day: currentWeekInfo.day,
          fl: currentWeekInfo.fl,
          schedule: currentWeekInfo.schedule,
        },
        otherSessions: camperInfo.weeks.filter((s) => s.weekNumber != weekId),
      };

      setData(camper);
    }
  }, [camperId]);
  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    camper && (
      <>
        <CommentDialog
          toggleCommentModal={toggleCommentDialog}
          camper={camper}
          open={showCommentDialog}
          onPush={onCommentPush}
        />
        <Box p={2}>
          <Box display="flex" flexDirection="column" alignItems="start">
            <Typography
              variant="h4"
              component={Link}
              to={`/camper/${camper.id}`}
            >
              {camper.firstName} {camper.lastName} - {camper.age}
            </Typography>
            <Typography variant="h6">{camper.pronouns}</Typography>
          </Box>
          <Stack direction="column" gap={2} mb={2}>
            <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
              <Typography variant="subtitle1">This Week:</Typography>
              <Chip
                sx={{ marginX: 2 }}
                color="success"
                icon={
                  camper.session.day ? (
                    <WbSunny />
                  ) : camper.session.fl ? (
                    <School />
                  ) : (
                    <CabinRounded />
                  )
                }
                label={
                  camper.session.cabin
                    ? `Cabin ${camper.session.cabin}`
                    : "Unassigned"
                }
              />{" "}
            </Box>
            {camper.otherSessions.length > 0 && (
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={1}
              >
                <Typography variant="subtitle1">Other Weeks:</Typography>
                {camper.otherSessions.map((s) => (
                  <Chip
                    sx={{ marginX: 2 }}
                    icon={
                      s.day ? <WbSunny /> : s.fl ? <School /> : <CabinRounded />
                    }
                    label={`Week ${s.display} ${
                      s.cabin !== null ? "(" + s.cabin + ")" : "unassigned"
                    }`}
                  />
                ))}
              </Box>
            )}
          </Stack>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />} display="flex">
              <Typography>Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CommentBox
                refreshData={loadData}
                toggleCommentModal={toggleCommentDialog}
                comments={camper.comments}
              />
            </AccordionDetails>
          </Accordion>
          <CapacitySignUp
            camper={camper}
            camperSessionId={camper.session.id}
            weekId={weekId}
            camperSchedule={camper.session.schedule}
            reloadCamper={loadData}
          />
        </Box>
      </>
    )
  );
};

export const RegistrationPage = () => {
  const auth = useContext(UserContext);
  const { weekId } = useParams();
  const [selected, setSelected] = useState(null);
  const handleSelect = (e, v) => {
    setSelected(v);
  };
  const [campers, setCampers] = useState({ loading: true, list: [] });
  // get camper for week on load
  useEffect(() => {
    const url = `/api/weeks/${weekId}/campers`;
    const getData = async () => {
      const response = await fetchWithToken(url, {}, auth);
      if (!response.ok) {
        throw new Error("Bad Request");
      } else {
        const campers = await response.json();
        setCampers({ loading: false, list: campers });
      }
    };
    getData();
  }, []);
  return (
    <Box py={1}>
      <CamperSearchBar
        handleSelect={handleSelect}
        selected={selected}
        campers={campers.list}
      />
      <h1>Week {weekId - 1}</h1>
      {selected && (
        <CamperDetails
          camperId={selected.id}
          weekId={Number.parseInt(weekId)}
        />
      )}
    </Box>
  );
};
