import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { DailySchedules } from "./DailySchedules";

export const DailyScheduleAccordion = ({ name, schedule,expanded,onExpand }) => {
  return (
    <Accordion expanded={expanded} onChange={onExpand}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{ bgcolor: "primary.main", color: "white", fontWeight: "bold" }}
      >
        {name}
      </AccordionSummary>
      <AccordionDetails>
        <List dense sx={{ bgcolor: "background.secondary", mt: 1 }}>
          {schedule.map((event) => (
              <ListItem key={`schedule-${name}-${event.time}`} divider={true}>
                <Stack>
                  <ListItemText
                    primary={event.time}
                    secondary={event.eventName}
                    primaryTypographyProps={{ color: "black" }}
                    secondaryTypographyProps={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  />
                </Stack>
              </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default DailySchedules;
