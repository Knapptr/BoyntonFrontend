import { PlusOne, Remove } from "@mui/icons-material";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";

const AdminThumbs = () => {
  const { weekNumber } = useParams();
  return (
    <>
    <Box py={4}>
    <Typography variant="h5">Thumbs Up 👍</Typography>
    <Typography variant="h3">Week {weekNumber - 1}</Typography>
    </Box>
    <ThumbsList weekNumber={weekNumber}/>
    </>
  );
};
export const ThumbsList = ({weekNumber}) => {
  const auth = useContext(UserContext);

  const [staff, setStaff] = useState([]);
  const [loading,setLoading] = useState(false)

  const getData = useCallback(async () => {
      const url = `/api/weeks/${weekNumber}/thumbs`;
      const result = await fetchWithToken(url, {}, auth);
      if (!result.ok) {
        console.error("Error getting thumbs up");
        return;
      }
      const data = await result.json();
    data.sort((a,b)=>(a.firstName.localeCompare(b.firstName)))
      setStaff(data);
    },[weekNumber,auth]
)
const handleRemove =(staffSessionId)=>async()=>{
  setLoading(true)
  const url = `/api/staff-sessions/${staffSessionId}/thumbs`;
  const result = await fetchWithToken(url,{method:"DELETE"},auth);
  if(!result.ok){console.error("Error removing thumbs up");return;}
  getData();
  setLoading(false)
}
 
const handleAdd =  (staffSessionId)=>async()=>{
  setLoading(true)
  const url = `/api/staff-sessions/${staffSessionId}/thumbs`;
  const result = await fetchWithToken(url,{method:"POST"},auth);
  if(!result.ok){console.error("Error adding thumbs up");return;}
  getData();
  setLoading(false);
}
  useEffect(() => {
    getData();
  }, [weekNumber,getData]);
    return <Box maxWidth="48rem"  bgcolor="background.paper">
      <List>
        {staff.map((s) => (
          <ListItem
            key={`staff-${s.id}`}
          >
            <ListItemText primary={<>
              <Stack direction="row" alignItems="center">
              {s.firstName} {s.lastName}
                <IconButton  color="warning" disabled={loading}>
                  <Remove onClick={handleRemove(s.id)}/>
                </IconButton>
                <IconButton disabled={loading} color="success" size="large">
                  <PlusOne  onClick={handleAdd(s.id)}/>
                </IconButton>
              </Stack>
              </>} secondary={s.count} />
          </ListItem>
        ))}
      </List>
    </Box>
}

export default AdminThumbs;
