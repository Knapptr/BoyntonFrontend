import { Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, Stack, TextField } from "@mui/material";
import { useContext, useState } from "react";
import fetchWithToken from "../fetchWithToken";
import usePops from "../hooks/usePops";
import UserContext from "./UserContext";

const CommentDialog = ({ open, camper, onPush, toggleCommentModal }) => {
  const { shamefulFailure, PopsBar } = usePops();
  const auth = useContext(UserContext);
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [hasDate, setHasDate] = useState(false);
  const [error, setError] = useState(false);
  const sendCommentToServer = async () => {
    const data = { content, camperId: camper.id, dueDate   };
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

  const toggleHasDate = () =>{
    setHasDate((d)=>{return !d})
  }

  const clearContent = () => {
    setContent("");
    setHasDate(null);
    setError(false);
  };
  const handleDueDateChange = (e) =>{
    setDueDate(()=>{
      const newDate = e.target.value;
    return newDate;
    })
  }
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

    <FormGroup> 
    <FormControlLabel control={<Checkbox checked={hasDate} onChange={toggleHasDate}  />} label="Has Due Date" />
    </FormGroup>
    
    <input type="date" onChange={handleDueDateChange}disabled={!hasDate} hidden={!hasDate} /> 
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

export default CommentDialog
