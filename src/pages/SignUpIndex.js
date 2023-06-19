import { useState, useEffect} from "react";
import { Outlet,useNavigate } from "react-router-dom";
import useGetDataOnMount from "../hooks/useGetData";
import "styled-components/macro";
// import cl from "../cl.png";

/** This once was something great...but now, it's just an outlet */
const SignUpIndex = () => {
	return (
		<>
			<Outlet />
		</>
	);
};

export default SignUpIndex;
