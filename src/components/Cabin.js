import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "styled-components/macro";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Card,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CamperItem from "./CamperItem";
import { cabinIsAssignable } from "../pages/CabinAssignment";

/** A utility function for counting camper types */
const getCamperTotals = (campers) => {
  const init = { dayCamp: 0, overnight: 0, fl: 0, total: 0 };
  return campers.reduce((sums, camper) => {
    if (camper.dayCamp) {
      sums.dayCamp += 1;
    } else {
      sums.overnight += 1;
    }
    if (camper.fl) {
      sums.fl += 1;
    }
    sums.total += 1;
    return sums;
  }, init);
};
const Cabin = ({
  assign,
  session,
  // allOpenState,
  unassignCamper,
  // selectedCampers,
  // cabinsOnly,
}) => {
  const [openList, setOpenList] = useState(false);

  const camperTotals = getCamperTotals(session.campers);
  console.log({ camperTotals });
  useEffect(() => {
    if (openList && session.campers.length === 0) {
      setOpenList(false);
    }
  }, [session.campers, openList]);

  /** Get min and max ages in cabin, ignoring FLs */
  const getMinMaxAge = () => {
    if (session.campers.every((c) => c.fl)) {
      return { min: "FL", max: "ONLY" };
    }
    // Cabins are sorted by age in the response, so iterate through until a non FL is found on each end
    let i = 0;
    let j = session.campers.length - 1;

    while (i < session.campers.length && session.campers[i].fl) {
      i++;
    }
    while (j > 0 && session.campers[j].fl) {
      j--;
    }
    if (j < 0) {
      return { min: session.campers[0].age, max: session.campers[0].age };
    }
    return { min: session.campers[i].age, max: session.campers[j].age };
  };

  return (
    <Card width={1}>
      <Box
        disabled={!cabinIsAssignable(session)}
        onClick={(e) => {
          e.stopPropagation();
          assign(session);
        }}
      >
        <Stack
          direction="row"
          component="header"
          justifyContent="space-between"
          align-items="center"
          sx={{
            py: 1,
            px: { xs: 4, md: 2 },
            backgroundColor: "secondary.main",
            color: "white",
          }}
        >
          <Box>
            <Typography fontWeight="light" variant="caption">
              cabin
            </Typography>
            <Typography variant="h5">{session.name}</Typography>
            <Typography
              visibility={
                camperTotals.overnight === session.capacity
                  ? "visible"
                  : "hidden"
              }
              fontWeight="light"
              variant="caption"
            >
              overnight full
            </Typography>
          </Box>
          <Stack alignItems="end" >
              <Stack
                direction="row"
                alignItems="center"
              >
                <Typography variant="caption">total:</Typography>
                <Typography fontWeight="bold">{camperTotals.total}</Typography>
              </Stack>
            <Stack direction="row" alignItems="center" >
              <Stack direction="row">
                <Typography variant="caption">overnight:</Typography>
              </Stack>
              <Typography color="white" fontWeight="bold">
                {camperTotals.overnight}
              </Typography>
              <Typography color="lightgrey">/{session.capacity}</Typography>
            </Stack>
            <Stack justifyContent="end">
              <Stack
                visibility={camperTotals.dayCamp === 0 ? "hidden" : "visible"}
                direction="row"
                alignItems="center"
   justifyContent="end" 
              >
                <Typography variant="caption">day:</Typography>
                <Typography color="white" fontWeight="bold">
                  {camperTotals.dayCamp}
                </Typography>
              </Stack>
              <Stack direction="row" mt={1} spacing={3.2} justifyContent="end">
                {[...Array(camperTotals.fl)].map(() => (
                  <Badge color="warning" badgeContent="fl">
                    <Box></Box>
                  </Badge>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Accordion
          expanded={openList}
          disabled={session.campers.length === 0}
          onChange={(e) => {
            setOpenList((t) => !t);
            e.stopPropagation();
          }}
        >
          <AccordionSummary
            expandIcon={session.campers.length > 0 && <ExpandMoreIcon />}
          >
            <Typography>
              {session.campers.length <= 0
                ? "Empty"
                : `Ages: ${getMinMaxAge().min} - ${getMinMaxAge().max}`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              {session.campers.map((camper, index) => {
                return (
                  <Stack
                    key={`camper-cabin-${camper.id}`}
                    direction="row"
                    alignItems="center"
                    sx={{
                      "&:nth-child(odd)": {
                        backgroundColor: "background.main",
                      },
                      "&:nth-child(even)": {
                        backgroundColor: "background.alt",
                      },
                    }}
                  >
                    <CamperItem camper={camper}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          unassignCamper(camper.id);
                        }}
                        size="small"
                        sx={{ ml: "auto" }}
                      >
                        <PersonRemoveIcon />
                      </IconButton>
                    </CamperItem>
                  </Stack>
                  /*<Grid container>
                    <Grid item xs={9}>
                      <Stack direction="row">
                        <Typography>
                          {camper.firstName} {camper.lastName}
                        </Typography>
                        <Typography>{camper.age}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={3}>
                      <PersonRemoveIcon />
                    </Grid>
                  <Grid item xs={12}>

                  </Grid>
                  </Grid>*/
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Card>
  );
};

export default Cabin;
