import react, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from "@mui/material";
import { useParams } from "react-router-dom";
import fetchWithToken from "../fetchWithToken";
import UserContext from "../components/UserContext";
import { Container, styled } from "@mui/system";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: "silver",
  },
  "&:nth-of-type(odd)": {
    backgroundColor: "lightGray",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AllCampers = () => {
  const auth = useContext(UserContext);
  const { weekNumber } = useParams("weekNumber");
  const [campers, setCampers] = useState([]);

  const getWeeklyCampers = useCallback(async () => {
    const url = `api/weeks/${weekNumber}/campers`;
    const response = await fetchWithToken(url, {}, auth);
    // TODO handle error/no result
    const data = await response.json();
    setCampers(data);
  }, [weekNumber]);

  //get campers on load
  useEffect(() => {
    getWeeklyCampers();
  }, [getWeeklyCampers]);
  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant="h6" my={3}>
          Campers: Week {weekNumber - 1}
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Last</TableCell>
                <TableCell>First</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Cabin</TableCell>
                <TableCell>Pronouns</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campers.map((c) => (
                <StyledTableRow>
                  <TableCell>{c.lastName}</TableCell>
                  <TableCell>{c.firstName}</TableCell>
                  <TableCell>{c.age}</TableCell>
                  <TableCell>{c.cabinAssignment || "Not Assigned"}</TableCell>
                  <TableCell>{c.pronouns}</TableCell>
                  <TableCell></TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default AllCampers;
