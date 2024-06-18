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
    <Box w={1}>
      <Box display="flex" justifyContent="end">
        <IconButton onClick={toggleCommentModal}>
          <AddCircleRounded />
        </IconButton>
      </Box>
      {(comments.length === 0 && (
        <Typography variant="subtitle1">None</Typography>
      )) || (
        <Stack
          gap={2}
          maxHeight="24rem"
          sx={{ overflow: "hidden", overflowY: "scroll" }}
        >
          {comments.map((c) => (
            <>
              <Box maxWidth="36rem">
                <Typography color="gray" align="left">
                  {c.firstName} {c.lastName} -{" "}
                  {new Date(c.date).toISOString().split("T")[0]}
                </Typography>
                <Typography align="left">{c.content}</Typography>
                {(c.username === auth.userData.user.username ||
                  auth.userData.user.role === "admin") && (
                  <Button
                    onClick={() => {
                      deleteCommentFromServer(c.id);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Box>
              <Divider flexItem />
            </>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CommentBox;
