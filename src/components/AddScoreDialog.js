import {
  Box,
  Stack,
  Button,
  MenuItem,
  Dialog,
  FormControl,
  DialogContent,
  TextField,
  DialogTitle,
} from "@mui/material";
import { useContext, useState } from "react";
import fetchWithToken from "../fetchWithToken";
import UserContext from "./UserContext";

const AddScoreDialog = ({ onClose, open, week }) => {
  const TEAMS = ["Naumkeag", "Tahattawan"];
  const auth = useContext(UserContext);

  const fetchAddPoints = async () => {
    const reqBody = { ...fields, weekNumber: week.number };
    const url = "/api/scores";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    };
    const response = await fetchWithToken(url, options, auth);
    await response.json();
  };

  const handleSubmit = async () => {
    await fetchAddPoints();
    handleClose();
  };

  const initFields = { awardedFor: "", awardedTo: TEAMS[0], points: 0 };
  const [fields, setFields] = useState(initFields);

  const handleChange = (e) => {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const allFieldsFilled = () => {
    return (
      fields.awardedFor.trim().length > 0 &&
      fields.points > 0 &&
      fields.awardedTo.trim().length > 0
    );
  };
  const handleClose = () => {
    onClose();
    setFields(initFields);
  };

  return (
    week && (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Award Points: Week {week.display}</DialogTitle>
        <DialogContent>
          <Box component="form" autoComplete="off">
            <FormControl>
              <Stack direction="row" paddingY={2} gap={2}>
                <TextField
                  sx={{
                    minWidth: "10rem",
                  }}
                  value={fields.awardedTo}
                  onChange={handleChange}
                  name="awardedTo"
                  id="outlined-basic"
                  label="Team"
                  variant="outlined"
                  select
                >
                  {TEAMS.map((team) => (
                    <MenuItem value={team} key={`team-select-${team}`}>
                      {team}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  name="points"
                  value={fields.points}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                  id="outlined-basic"
                  label="Points"
                  type="number"
                  variant="outlined"
                />
              </Stack>
              <Box width={1}>
                <TextField
                  name="awardedFor"
                  value={fields.awardedFor}
                  onChange={handleChange}
                  id="outlined-basic"
                  label="Reason"
                  variant="outlined"
                />
              </Box>
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="space-around" marginY={2}>
            <Button variant="outlined" color="warning" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              enabled={allFieldsFilled() ? "false" : undefined}
              onClick={() => {
                if (allFieldsFilled()) {
                  handleSubmit();
                }
              }}
            >
              Score!
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    )
  );
};
export default AddScoreDialog;
