import { AddCircleRounded, Edit } from "@mui/icons-material";
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
  TableBody,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox";
import CommentDialog from "../components/CommentDialog";
import PronounDialog from "../components/PronounDialog";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";

const CamperInfoBox = ({ camper, setShowPronounDialog }) => {
  return (
    <Grid container>
      <Grid item xs={12} sm={4}>
        <Box maxWidth="150px">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Age</TableCell>
                <TableCell>{camper.age}</TableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell>Area</TableCell>
                <TableCell>{camper.gender === "Male" ? "BA" : "GA"}</TableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell>Pronouns</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center">
                    <IconButton onClick={() => setShowPronounDialog(true)}>
                      <Edit />
                    </IconButton>
                    {camper.pronouns || "assumed"}{" "}
                  </Stack>
                </TableCell>
              </TableRow>
            </TableHead>
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
              <TableBody>
                <TableRow>
                  <TableCell>{w.display}</TableCell>
                  <TableCell>{w.cabin || "unassigned"}</TableCell>
                  <TableCell>{(w.fl && "FL") || (w.day && "Day")}</TableCell>
                </TableRow>
              </TableBody>
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
  const [showPronounDialog, setShowPronounDialog] = useState(false);
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
      <PronounDialog
        open={showPronounDialog}
        onClose={() => {
          setShowPronounDialog(false);
          loadData();
        }}
        camper={camper}
      />
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
          <CamperInfoBox
            camper={camper}
            setShowPronounDialog={setShowPronounDialog}
          />
        </Stack>
      </Card>
      <Box my={2}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h5" textAlign="left">
            Notes
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
          {camper.weeks
            .filter((w) => Object.keys(w.schedule).length > 0)
            .map((w) => {
              return (
                <Card>
                  <CardHeader
                    title={`Week ${w.display}`}
                    subheader="schedule"
                  />
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
