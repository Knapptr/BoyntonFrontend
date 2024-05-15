import { Autocomplete, Box, Chip, Grid, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";

const UserAdminPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const auth = useContext(UserContext);
  const { username } = useParams();

  const loadUsers = useCallback(async () => {
    const url = "/api/users";
    const response = await fetchWithToken(url, {}, auth);
    const data = await response.json();
    setUsers(data);
  }, []);

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
  }, [users]);
  useEffect(() => {
    if (selectedUser) {
      navigate(`/admin/users/${selectedUser.username}`);
    }
  }, [selectedUser]);

  const handleUserSearchInput = (event, value) => {
    setSearchInputValue(value);
  };
  const handleUserSelect = (event, value) => {
    setSelectedUser(value);
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
            renderInput={(params) => (
              <TextField {...params} label="User Select" />
            )}
          />
          {selectedUser && (
            <Grid container>
              <Grid item>
                <Typography>
                  {selectedUser.firstName} {selectedUser.lastName}
                </Typography>
                <Typography>{selectedUser.role}</Typography>
                <Box display="flex" gap={1}>
            {selectedUser.firstYear && <Chip label ="First Year"/>}
            {selectedUser.senior && <Chip label ="Senior Staff"/>}
            {selectedUser.lifeguard && <Chip label="Lifeguard"/>}
            {selectedUser.ropes && <Chip label="Ropes"/>}
            {selectedUser.archery && <Chip label="Archery"/>}
            </Box>
            <Box>
            <Typography>Sessions</Typography>
            <Stack component={"ul"} p={0}>
            {selectedUser.sessions.map(s=>{
              return <Box component="li" sx={{listStyle:"none"}}>Week {s.weekNumber - 1}</Box>
            })}
            </Stack>
            </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </>
  );
};
export default UserAdminPage;
