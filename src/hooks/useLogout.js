import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../components/UserContext";
import { fetchWithoutToken} from "../fetchWithToken";
import catchErrors from "../utils/fetchErrorHandling";

const useLogout = () =>{
  const navigate = useNavigate();

  const logout = async ({username,password}) => {
      navigate("/login");}

	return {logout}
}

export default useLogout
