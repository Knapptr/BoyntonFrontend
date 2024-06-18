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
import useDownloadLink from "../hooks/useGetDownloadLink";
import WeekContext from "./WeekContext";

const PrintAwardsDialog = ({ open, onClose }) => {
  const [ download ] = useDownloadLink();
  const {
    weeks,
    selectedWeek,
    WeekSelection,
  } = useContext(WeekContext);

  const handleItemClick = async (week) => {
    handleClose();
    const url = `/api/awards/${week.number}/print`;
    await download(url,`awards-week${week.display}.pptx`);
  };

  const handleClose = () => {
    onClose();
  };
  const handleSubmit = () => {
    handleItemClick(selectedWeek());
    handleClose();
  };

  const getUrl = () => {
    return `/registration/${selectedWeek()?.number}`;
  };

  return (
    <Dialog
      PaperProps={{ elevation: 8 }}
      open={weeks && open}
      onClose={onClose}
    sx={{maxWidth: 400, mx:"auto"}}
    >
      <DialogTitle component="div">
    <Typography variant="subtitle2" component="h5">Registration</Typography>
    <Typography variant="h6" fontWeight="bold">Select Week</Typography></DialogTitle>
      <Box width={1}  px={1} mb={1}>
        <Grid
          container
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
        <Button color="warning" variant="outlined" onClick={handleClose}>
          Nevermind
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedWeek()}
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

export default PrintAwardsDialog
