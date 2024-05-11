import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Card,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Container,
  Divider,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Modal,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";
import usePops from "../hooks/usePops";

const CommentDialog = ({ open, camper, onPush, toggleCommentModal }) => {
  const { shamefulFailure, PopsBar } = usePops();
  const auth = useContext(UserContext);
  const [content, setContent] = useState("");
  const [error, setError] = useState(false);
  const sendCommentToServer = async () => {
    const data = { content, camperId: camper.id };
    const url = "/api/camper-comment";
    const config = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    };
    const serverResponse = await fetchWithToken(url, config, auth);
    if (serverResponse.status === 200) {
      clearContent();
      onPush();
    } else {
      shamefulFailure("Error!", "Check the request");
      console.log({ requestBody: config });
    }
  };

  const clearContent = () => {
    setContent("");
    setError(false);
  };
  const handleContentChange = (e) => {
    setContent(() => {
      const newData = e.target.value;
      if (newData) {
        setError(false);
      } else {
        setError(true);
      }
      return newData;
    });
  };
  return (
    <Dialog open={open} fullWidth>
      <PopsBar />
      <DialogTitle>
        Add Comment for {camper.firstName} {camper.lastName}
      </DialogTitle>
      <DialogContent>
        <TextField
          error={error}
          helperText={error && "Camper notes may not be blank."}
          multiline
          minRows={5}
          fullWidth
          value={content}
          onChange={handleContentChange}
        />
      </DialogContent>
      <Stack direction="row">
        <Button
          color="warning"
          variant="contained"
          onClick={() => {
            toggleCommentModal();
            clearContent();
          }}
        >
          Cancel
        </Button>
        <Button
          color="success"
          variant="contained"
          disabled={content.length === 0}
          onClick={sendCommentToServer}
        >
          Add Comment
        </Button>
      </Stack>
    </Dialog>
  );
};
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
          <TableCell>{camper.gender == "Male" ? "BA" : "GA"}</TableCell>
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
          <TableCell>{w.fl && "FL" || w.day && "Day"}</TableCell>
          </TableRow>
        ))}
      </Table>
    </Box>
  );
};

const CommentBox = ({ comments, toggleCommentModal, refreshData }) => {
  const auth = useContext(UserContext);
  const { shamefulFailure } = usePops();

  const deleteCommentFromServer = async (id) => {
    const url = `/api/camper-comment/${id}`;
    const config = { method: "DELETE" };
    const serverResponse = await fetchWithToken(url, config, auth);
    if (serverResponse.status === 200) {
      refreshData();
    } else {
      shamefulFailure("Error Deleting Comment", "See an administrator");
    }
  };
  return (
    <Box maxWidth={{ xs: 1, sm: 0.75 }}>
      <Box display="flex" justifyContent="end">
        <IconButton onClick={toggleCommentModal}>
          <AddIcon />
        </IconButton>
      </Box>
      {(comments.length === 0 && (
        <Typography variant="subtitle1">None</Typography>
      )) || (
        <Stack
          gap={2}
          maxHeight="24rem"
          sx={{ overflow: "hidden", overflowY: "scroll" }}
        >
          {comments.map((c) => (
            <>
              <Box maxWidth="36rem">
                <Typography color="gray" align="left">
                  {c.firstName} {c.lastName} -{" "}
                  {new Date(c.date).toISOString().split("T")[0]}
                </Typography>
                <Typography align="left">{c.content}</Typography>
                {(c.username === auth.userData.user.username ||
                  auth.userData.user.role === "admin") && (
                  <Button
                    onClick={() => {
                      deleteCommentFromServer(c.id);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Box>
              <Divider flexItem />
            </>
          ))}
        </Stack>
      )}
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
  }, [camperId]);
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
