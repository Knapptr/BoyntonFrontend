import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import WeekContext from "./WeekContext";

const WeekSelectDialog = ({ open, onClose, url, title, onSubmit }) => {
  const { weeks, selectedWeek, WeekSelection } = useContext(WeekContext);

  const handleClose = (reason) => {
    onClose(reason);
  };
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(selectedWeek());
    }
    handleClose();
  };

  const getUrl = () => {
    return `${url}/${selectedWeek()?.number}`;
  };

  return (
    <Dialog
      PaperProps={{ elevation: 8 }}
      open={weeks && open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle component="div">
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="h6" fontWeight="bold">
          Select Week
        </Typography>
      </DialogTitle>
      <Box width={1} px={1} mb={1}>
        <Grid
          container
          width={1}
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <WeekSelection />
          </Grid>
        </Grid>
      </Box>
      <DialogActions>
        <Stack direction="row" spacing={2}>
          <Button
            color="warning"
            variant="outlined"
            onClick={() => handleClose("cancel")}
          >
            Nevermind
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedWeek()}
            href={!onSubmit && getUrl()}
            color="primary"
            variant="contained"
          >
            Go
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default WeekSelectDialog;
