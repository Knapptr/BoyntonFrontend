import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import { useContext, useState } from "react";
import fetchWithToken from "../fetchWithToken";
import UserContext from "./UserContext";

const PronounDialog = ({ open, onClose, camper, }) => {
  const auth = useContext(UserContext);
  const [submitting,setSubmitting] = useState(false);
  const [pronouns, setPronouns] = useState(camper.pronouns || "");
  const handlePronounChange = (e) => {
    setPronouns(e.target.value);
  };

  const handlePronounSubmit = async (e) => {
    setSubmitting(true);
    const url = `/api/campers/${camper.id}/pronouns`;
    const options = {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({pronouns})
    };
    const result = await fetchWithToken(url, options, auth);
    if (!result.ok) {
      console.error("Something went wrong with pronouns");
      onClose();
      return;
    }
    onClose();
    setSubmitting(false);
  };
  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle>
        Edit Pronouns for {camper.firstName} {camper.lastName}
      </DialogTitle>
      <DialogContent>
        <TextField value={pronouns} onChange={handlePronounChange} />
      </DialogContent>
      <Stack direction="row" gap={2}>
        <Button variant="contained" color="error" onClick={onClose}>Cancel</Button>
        <Button disabled={submitting}variant="contained" color="success" onClick={handlePronounSubmit}>{(submitting&&<CircularProgress />)||"Submit"}</Button>{" "}
      </Stack>
    </Dialog>
  );
};

export default PronounDialog;
