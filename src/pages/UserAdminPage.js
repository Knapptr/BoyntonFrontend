import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../components/UserContext";
import UserSessionView from "../components/UserSessionView";
import fetchWithToken from "../fetchWithToken";

const UserAdminPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserSession, setSelectedUserSession] = useState(null);
  const auth = useContext(UserContext);
  const { username } = useParams();

  const loadUsers = useCallback(async () => {
    const url = "/api/users";
    const response = await fetchWithToken(url, {}, auth);
    const data = await response.json();
    setUsers(data);
  }, [auth]);

  useEffect(() => {
    if (users.length > 0) {
      //handle if this is not the search page by selecting the user with the paramaterized username
      if (username) {
        //select username OR display "user not found"
        const user = users.find((u) => u.username === username);
        // console.log({user});
        setSelectedUser(user);
      }
    }
  }, [users, username]);
  useEffect(() => {
    if (selectedUser) {
      navigate(`/admin/users/${selectedUser.username}`);
    }
  }, [selectedUser, navigate]);

  const handleUserSelect = (event, value) => {
    setSelectedUser(value);
    // set equivalent session
    if (selectedUserSession) {
      const weekNumber = selectedUserSession.weekNumber;
      console.log({ value });
      const newSession =
        value.sessions.find((s) => s.weekNumber === weekNumber) || null;
      console.log({ newSession });
      setSelectedUserSession(newSession);
    }
  };

  const handleUserSessionSelect = (event, value) => {
    setSelectedUserSession(value);
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <>
      {users.length > 0 && (
        <Box mt={2}>
          <Autocomplete
            options={users}
            value={selectedUser}
            onChange={handleUserSelect}
            getOptionLabel={(o) => `${o.firstName} ${o.lastName}`}
            getOptionKey={(o) => `user-option-${o.username}`}
            isOptionEqualToValue={(o, v) => o.username === v.username}
            renderInput={(params) => (
              <TextField {...params} label="User Select" />
            )}
          />
          {selectedUser && (
            <Grid container>
              <Grid item xs={12} sm={2}>
                <Typography>
                  {selectedUser.firstName} {selectedUser.lastName}
                </Typography>
                <Typography>{selectedUser.role}</Typography>
                <Box display="flex" gap={1}>
                  {selectedUser.firstYear && <Chip label="First Year" />}
                  {selectedUser.senior && <Chip label="Senior Staff" />}
                  {selectedUser.lifeguard && <Chip label="Lifeguard" />}
                  {selectedUser.ropes && <Chip label="Ropes" />}
                  {selectedUser.archery && <Chip label="Archery" />}
                </Box>
                <Box>
                  <Typography>Sessions</Typography>
                  <Stack component={"ul"} p={0}>
                    {selectedUser.sessions.map((s) => {
                      return (
                        <Stack
                          key={`weekData-${s.weekNumber}-${s.username}`}
                          component="li"
                          direction="row"
                          sx={{ listStyle: "none" }}
                        >
                          <Box>Week {s.weekNumber - 1}</Box>
                          <Box>
                            {(s.cabinAssignment &&
                              `Cabin ${s.cabinAssignment}`) ||
                              "Unassigned"}
                          </Box>
                        </Stack>
                      );
                    })}
                    <Button variant="outlined">Add Session</Button>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} sm={10}>
                <Autocomplete
                  options={selectedUser.sessions}
                  value={selectedUserSession}
                  onChange={handleUserSessionSelect}
                  getOptionKey={(o) => `session-option-${o.id}`}
            isOptionEqualToValue={(o,v)=>o.id === v.id}
                  getOptionLabel={(o) => `Week ${o.weekNumber - 1}`}
                  renderInput={(props) => <TextField {...props} />}
                />
                {(selectedUserSession && (
                  <UserSessionView
                    assignCabin={async (cabinSessionId) => {
                      await loadUsers();
                      setSelectedUserSession((old) => {
                        return { ...old, cabinSessionId };
                      });
                    }}
                    session={selectedUserSession}
                  />
                )) || <Typography>Select A Session</Typography>}
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </>
  );
};
export default UserAdminPage;
