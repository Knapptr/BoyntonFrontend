import { AddCircleRounded } from "@mui/icons-material";
import { Divider, IconButton, Typography,Button } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useContext } from "react";
import fetchWithToken from "../fetchWithToken";
import usePops from "../hooks/usePops";
import UserContext from "./UserContext";

const CommentBox = ({ comments, toggleCommentModal, refreshData }) => {
  const auth = useContext(UserContext);
  const { shamefulFailure } = usePops();

  const deleteCommentFromServer = async (id) => {
    const url = `/api/camper-comment/${id}`;
    const config = { method: "DELETE" };
    const serverResponse = await fetchWithToken(url, config, auth);
    if (serverResponse.status === 200) {
      refreshData();
    } else {
      shamefulFailure("Error Deleting Comment", "See an administrator");
    }
  };
  return (
    <Box width={1}>
      {(comments.length === 0 && (
        <Typography variant="subtitle1" textAlign="left">None</Typography>
      )) || (
        <Stack
          gap={2}
          maxHeight="15rem"
        pt={3}
          sx={{ overflow: "hidden", overflowY: "scroll" }}
        >
          {comments.map((c) => (
            <Box>
                <Typography align="left">{c.content}</Typography>
            <Stack direction="row" alignItems="center" >
                <Typography color="gray" align="left" variant="subtitle1" mr={2}>
                  {c.firstName} {c.lastName} -{" "}
                  {new Date(c.date).toISOString().split("T")[0]}
                </Typography>
                {(c.username === auth.userData.user.username ||
                  auth.userData.user.role === "admin") && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      deleteCommentFromServer(c.id);
                    }}
                  >
                    Delete
                  </Button>
                )}
            </Stack>
              <Divider flexItem />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CommentBox;
