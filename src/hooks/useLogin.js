import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../components/UserContext";
import { fetchWithoutToken} from "../fetchWithToken";
import catchErrors from "../utils/fetchErrorHandling";

const useLogin = ({onErr,onSubmit=()=>{}}) =>{
  const location = useLocation();
  const navigate = useNavigate();
const auth = useContext(UserContext);
  const { cameFrom } = location.state || { cameFrom: null };

  const login = async ({username,password}) => {
    const reqOptions = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password })}

    const result = await fetchWithoutToken("/auth/login", reqOptions);
    const data = await catchErrors(result, (e) => {
		onSubmit()
		onErr(e)
      // shamefulFailure("SHAME!", e.message);
    });
    if (data) {
      const userData = await data.json();
      auth.logIn(userData.token, userData.user);
      navigate(cameFrom || "/");
    }
    };

	return {login}
}

export default useLogin;
