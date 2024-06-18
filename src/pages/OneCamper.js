import {
  Box,
  Card,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Divider,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox";
import CommentDialog from "../components/CommentDialog";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";

const CamperInfoBox = ({ camper }) => {
  return (
    <Box>
      <Table>
        <TableRow>
          <TableHead>
            <TableCell>Age</TableCell>
          </TableHead>
          <TableCell>{camper.age}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead>
            <TableCell>Area</TableCell>
          </TableHead>
          <TableCell>{camper.gender === "Male" ? "BA" : "GA"}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead>
            <TableCell>Pronouns</TableCell>
          </TableHead>
          <TableCell>{camper.pronouns || "assumed"}</TableCell>
        </TableRow>
      </Table>
    </Box>
  );
};
const WeeksBox = ({ camper }) => {
  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Theme</TableCell>
            <TableCell>Cabin</TableCell>
    <TableCell>Other</TableCell>
          </TableRow>
        </TableHead>
        {camper.weeks.map((w) => (
          <TableRow>
            <TableCell>{w.number}</TableCell>
            <TableCell>{w.title}</TableCell>
            <TableCell>{w.cabinName || "unassigned"}</TableCell>
          <TableCell>{(w.fl && "FL") ||( w.day && "Day")}</TableCell>
          </TableRow>
        ))}
      </Table>
    </Box>
  );
};


const OneCamper = () => {
  // set important vars
  const { camperId } = useParams();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const auth = useContext(UserContext);
  const [camper, setCamper] = useState();
  const [error, setError] = useState({ reason: undefined });
  const handleCommentPush = () => {
    setShowCommentModal(false);
    loadData();
  };

  const loadData = useCallback(async () => {
    const url = `api/campers/${camperId}`;
    const response = await fetchWithToken(url, {}, auth);
    if (response.status !== 200) {
      setError({ reason: "Camper Not Found" });
    } else {
      const data = await response.json();
      setCamper(data);
    }
  }, [camperId,auth]);
  // get camper on load
  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleCommentModal = () => {
    setShowCommentModal((s) => !s);
  };

  return camper ? (
    <Box my={2} width={1}>
      <CommentDialog
        open={showCommentModal}
        camper={camper}
        toggleCommentModal={toggleCommentModal}
        onPush={handleCommentPush}
      />
      <Card>
        <Typography px={2} py={2} variant="h5" component="h3" align={"left"}>
          {camper.firstName} {camper.lastName}
        </Typography>
        <Stack
          px={2}
          py={2}
          spacing={5}
          direction={{ xs: "column", sm: "row" }}
        >
          <Box>
            <Typography variant="h6">Details</Typography>
            <CamperInfoBox camper={camper} />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="h6">Weeks</Typography>
            <WeeksBox camper={camper} />
          </Box>
        </Stack>
      </Card>
      <Box>
        <Card>
          <CardHeader title="Notes" />
          <CardContent>
            <CommentBox
              comments={camper.comments}
              toggleCommentModal={toggleCommentModal}
              refreshData={loadData}
            />
          </CardContent>
        </Card>
      </Box>
      <Box my={1}>
        <Stack>
          {camper.weeks.map((w) => {
            return (
              <Card>
                <CardHeader title={`Week ${w.number}`} subheader="schedule" />
                <CardContent>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-evenly"
                    flexWrap="wrap"
                  >
                    {Object.keys(w.schedule).map((dayName) => {
                      const day = w.schedule[dayName];
                      return (
                        <Box bgcolor="primary.main">
                          <Typography
                            bgcolor="secondary.main"
                            color="white"
                            variant="subtitle1"
                          >
                            {dayName}
                          </Typography>
                          <List>
                            {Object.keys(day).map((periodNumber) => {
                              const period = day[periodNumber];
                              return (
                                <>
                                  <ListItem
                                    component={Link}
                                    to={`/schedule/activity/${period.activitySessionId}`}
                                  >
                                    <ListItemText
                                      primary={`Act ${periodNumber}`}
                                      secondary={period.activity}
                                    />
                                  </ListItem>
                                </>
                              );
                            })}
                          </List>
                        </Box>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>
    </Box>
  ) : error.reason ? (
    <h1>{error.reason}</h1>
  ) : (
    <h1>Loading</h1>
  );
};

export default OneCamper;
