import { AddCircle, CheckSharp } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";

/** A helper function*/
const isOverflowAct = (activity) => {
  return activity.capacity !== null;
};

const ActivityList = () => {
  // init contexts
  const auth = useContext(UserContext);
  // init states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activityEdits, setActivityEdits] = useState(null);
  // handlers
  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setActivityEdits(null);
  };
  const openEditDialog = () => {
    setEditDialogOpen(true);
  };
  const selectEditActivity = (activity) => () => {
    setActivityEdits(activity);
    openEditDialog();
  };
  const handleUpdateSuccess = () =>{
    loadActivities();
  }
  // effects and Callbacks
  const loadActivities = useCallback(async () => {
    const url = "/api/activities";
    const response = await fetchWithToken(url, {}, auth);
    if (!response.ok) {
      console.error("Something went wrong getting activities");
      return;
    }
    const data = await response.json();
    // sort alpha
    data.sort((a, b) => a.name.localeCompare(b.name));
    setActivities(data);
  }, [auth]);
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);
  return (
    <Box maxWidth={1}>
      <EditActivityDialog
        open={editDialogOpen}
        onClose={closeEditDialog}
        activity={activityEdits}
    onSuccess={handleUpdateSuccess}
      />
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "secondary.main" }}>
            <TableCell>
              <Typography color="white">Activity</Typography>
            </TableCell>
            <TableCell>
              <Typography color="white">Description</Typography>
            </TableCell>
            <TableCell>
              <Typography color="white">Overflow Act</Typography>
            </TableCell>
            <TableCell>
              <Typography color="white">ID</Typography>
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                endIcon={<AddCircle />}
              >
                Create Activity
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((a) => (
            <TableRow
              sx={{
                "&:nth-of-type(even)": {
                  backgroundColor: "background.primary.light",
                },
              }}
              key={`actvity-listing-${a.id}`}
            >
              <TableCell>{a.name}</TableCell>
              <TableCell>{a.description}</TableCell>
              <TableCell>{a.capacity !== null && <CheckSharp />}</TableCell>
              <TableCell>{a.id}</TableCell>
              <TableCell>
                <Button onClick={selectEditActivity(a)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

const EditActivityDialog = ({ open, onClose, activity,onSuccess }) => {
  const auth = useContext(UserContext);
  const [edits, setEdits] = useState(null);
  const handleEdits = (field) => (event) => {
    setEdits((e) => ({ ...e, [field]: event.target.value }));
  };
  const handleOverflowEdit = (event) => {
    const isChecked = event.target.checked;
    const capacityValue = isChecked ? 10 : null;
    setEdits((e) => ({ ...e, capacity: capacityValue }));
  };
  // Whenever the activity changes, set the edits to reflect that activity
  useEffect(() => {
    setEdits(activity);
  }, [activity]);

  // The PUT request to update on the server
  const handleSubmit = async () => {
    const url = `/api/activities/${activity.id}`;
    const updatedFields = { ...edits };
    const options = {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ updatedFields }),
    };
    const result = await fetchWithToken(url, options, auth);
    if (!result.ok) {
      console.error("Something went wrong with submitting changes to activity");
      return;
    }
    console.log("OK!");
    onClose();
    onSuccess();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>Edit Activity</DialogTitle>
      <DialogContent>
        {edits && (
          <FormControl fullWidth>
            <Stack gap={1} my={1}>
              <TextField
                id="name-edit"
                label="Name"
                value={edits.name}
                onChange={handleEdits("name")}
              />
              <TextField
                multiline
                rows={3}
                id="description-edit"
                label="Description"
                value={edits.description}
                onChange={handleEdits("description")}
              />
              <FormControlLabel
                label="Overflow Activity"
                control={
                  <Checkbox
                    checked={isOverflowAct(edits)}
                    onChange={handleOverflowEdit}
                  />
                }
              />
            </Stack>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button
    onClick={handleSubmit}
    >Submit</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
export default ActivityList;
