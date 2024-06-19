import { AddCircleRounded } from "@mui/icons-material";
import {
  Box,
  Card,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox";
import CommentDialog from "../components/CommentDialog";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";

const CamperInfoBox = ({ camper }) => {
  return (
    <Grid
    container
    >
    <Grid item xs={12} sm={4} >
    <Box maxWidth="150px">
      <Table size="small">
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
  </Grid>
    <Grid item xs={12} sm={8}>
    <Box maxWidth="600px">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Week</TableCell>
            <TableCell>Cabin</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        {camper.weeks.map((w) => (
          <TableRow>
            <TableCell>{w.display}</TableCell>
            <TableCell>{w.cabin|| "unassigned"}</TableCell>
            <TableCell>{(w.fl && "FL") || (w.day && "Day")}</TableCell>
          </TableRow>
        ))}
      </Table>
    </Box>
    </Grid>
    </Grid>
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
  }, [camperId, auth]);
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
        <Stack>
          <CamperInfoBox camper={camper} />
        </Stack>
      </Card>
          <Box my={2}>
    <Stack direction="row" alignItems="center">
            <Typography variant="h5" textAlign="left">Notes

    </Typography>
        <IconButton color="success" onClick={toggleCommentModal}>
          <AddCircleRounded />
        </IconButton>
    </Stack>
            <CommentBox
              comments={camper.comments}
              toggleCommentModal={toggleCommentModal}
              refreshData={loadData}
            />
          </Box>
      <Box my={1}>
        <Stack>
          
          {camper.weeks.filter(w=>Object.keys(w.schedule).length > 0).map((w) => {
            return (
              <Card>
                <CardHeader title={`Week ${w.display}`} subheader="schedule" />
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
