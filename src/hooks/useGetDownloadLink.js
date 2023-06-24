import { useContext } from "react";
import UserContext from "../components/UserContext";
import fetchWithToken from "../fetchWithToken";

const useDownloadLink = () => {
  const auth = useContext(UserContext);
  const download = async (url,fileName) => {
    const results = await fetchWithToken(url, {}, auth);
    const blob = await results.blob();
    const downloadBlob = new Blob([blob]);
    const link = document.createElement("a");
    const downloadUrl = window.URL.createObjectURL(downloadBlob);
    link.href = downloadUrl;
    link.setAttribute("download", fileName);
    link.click();
  };

  return [download];
};
export default useDownloadLink;
