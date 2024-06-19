import WeekSelectDialog from "../components/WeekSelectDialog";
import ActivitySignUpDialog from "../components/ActivitySignUpDialog";
import RegistrationDialog from "../components/RegistrationDialog";
import PrintAwardsDialog from "../components/PrintAwardsDialog";
import CamperListDialog from "../components/CamperListDialog";
import CabinAssignmentDialog from "../components/CabinAssignmentDialog";
import AttendanceDialog from "../components/AttendanceDialog";
import { useState } from "react";
import AddScoreDialog from "../components/AddScoreDialog";

const useDialogs = () => {
  const [openDialog, setOpenDialog] = useState(null);

  const handleDialogs = (dialogName) => {
    console.log("handling");
    setOpenDialog(dialogName);
  };
  const handleClose = () => {
    setOpenDialog(null);
  };

  const [awardWeekSelect, setAwardWeekSelect] = useState(null);
  const handleAwardWeekSelect = (weekNumber) => {
    setAwardWeekSelect(weekNumber);
    setOpenDialog("awardpoints");
  };
  const handleAwardWeekClose = (reason) => {
    if (reason === "cancel") {
      setOpenDialog(null);
    }
  };
  const AllDialogs = () => {
    return (
      <>
        {/* Navigation Dialogs */}
        <WeekSelectDialog
          title="Give Award"
          open={openDialog === "giveaward"}
          onClose={handleClose}
          url="/award"
        />
        {/* Award Dialog */}
        <WeekSelectDialog
          title="Award Points"
          open={openDialog === "awardpointsselect"}
          onClose={handleAwardWeekClose}
          onSubmit={(week) => handleAwardWeekSelect(week)}
        />
        <AddScoreDialog
          open={openDialog === "awardpoints"}
          onClose={handleClose}
          week={awardWeekSelect}
        />

        {/* Cabin List*/}
        <WeekSelectDialog
          title="Cabin List"
          open={openDialog === "cabinlist"}
          onClose={handleClose}
          url="/cabins/list"
        />

        {/* Programming */}
        <WeekSelectDialog
          title="Edit Activity Schedule"
          open={openDialog === "programming"}
          onClose={handleClose}
          url="/schedule/programming"
        />

        {/* Cabin Assignment */}
        <CabinAssignmentDialog
          open={openDialog === "cabinassignment"}
          onClose={handleClose}
        />

        {/* Attendance */}
        <AttendanceDialog
          open={openDialog === "attendance"}
          onClose={handleClose}
        />

        {/* Staffing */}
        <WeekSelectDialog
          title="Staffirg"
          open={openDialog === "staffing"}
          onClose={handleClose}
          url="schedule/staffing"
        />

        {/* Activity Sign Up */}
        <ActivitySignUpDialog
          open={openDialog === "signup"}
          onClose={handleClose}
        />
        {/* Print Awards Dialog*/}
        <PrintAwardsDialog
          open={openDialog === "printawards"}
          onClose={handleClose}
        />
        {/* Registration Dialog*/}
        <RegistrationDialog
          open={openDialog === "registration"}
          onClose={handleClose}
        />
        {/* Camper List Dialog*/}
        <CamperListDialog
          open={openDialog === "camperlist"}
          onClose={handleClose}
        />
      </>
    );
  };
  return { handleDialogs, AllDialogs };
};
export default useDialogs;
