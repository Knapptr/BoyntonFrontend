import fetchWithToken from "../fetchWithToken";

export const postCampersToActivity = async (campers, activitySessionId, auth) => {
  const reqConfig = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ campers }),
  };
  const result = await fetchWithToken(
    `/api/activity-sessions/${activitySessionId}/campers`,
    reqConfig,
    auth
  );

  if (result.status !== 200){
    throw new Error("Invalid request or bad connection");
  }
  return result;
}


