import { Outlet} from "react-router-dom";
import "styled-components/macro";

/** This once was something great...but now, it's just an outlet */
const SignUpIndex = () => {
	return (
		<>
			<Outlet />
		</>
	);
};

export default SignUpIndex;
