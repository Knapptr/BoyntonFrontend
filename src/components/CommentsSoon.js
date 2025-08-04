import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useContext, useEffect, useState } from "react";
import fetchWithToken from "../fetchWithToken";
import UserContext from "./UserContext";

const SoonNote = ({comment})=>{
return <Typography>{comment.first_name} {comment.last_name}: {comment.content}</Typography>
}

const CommentsSoon = () => {
  const auth = useContext(UserContext);
  const [comments, setComments] = useState([]);


  const getDailyComments = useCallback(async () => {
    const url = `api/camper-comment/soon`;
    const response = await fetchWithToken(url, {}, auth);
    return response;
  }, [auth]);

  const handleGetComments = useCallback(async () => {
    const response = await getDailyComments();
    if (response.status !== 200) {
      console.error("Big time error");
    }
    const comments = await response.json();
    setComments(comments);
  }, [getDailyComments]);

  const splitComments = () => {
    const today = comments.filter((c) => {
      const date = new Date(c.due_date);
      return date.toDateString() === new Date().toString().split(/\d\d:/)[0]
    });
    const tDate = new Date();
    tDate.setDate(tDate.getDate() + 1);
    const tomorrow = comments.filter((c) => {
      const date = new Date(c.due_date);
      return date.toDateString() === tDate.toString().split(/\d\d:/)[0]
    });
    return { today, tomorrow };
  };

  useEffect(()=>{
    handleGetComments();
  },[handleGetComments])

  if (comments.length > 0) {
    return <Box my={1}>
      <Typography>Camper Notes</Typography>
      <Stack direction="row" justifyContent="space-evenly">
        <Box>
          <Typography>Today</Typography>
          <Stack>
            {splitComments().today.map((c) => (
              <SoonNote comment={c} />
            ))}
          </Stack>
        </Box>
        <Box>
          <Typography>Tommorrow</Typography>
          <Stack>
            {splitComments().tomorrow.map((c) => (
              <SoonNote comment={c} />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>;
  } else {
    return;
  }
};

export default CommentsSoon
