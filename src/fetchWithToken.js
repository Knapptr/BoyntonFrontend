import { redirect } from "react-router-dom";

const fetchWithToken = async (url, options = {}, auth) => {
	// Send requests to api url
	const urlRoute = handleUrlString(url);

	const optionsWithToken = {
		...options,
		headers: { ...options.headers, authorization: `Bearer ${auth.userData.token}` },
	};
	try {
		const response = await fetch(urlRoute, optionsWithToken);
		if(response.status === 401){
			//logout
			auth.logOut()
			redirect("/login")
		}
		return response;
	} catch {
		return { status: 400, message: `Failed to Fetch Data. Something Went Wrong. Check your network connection.` }
	}
};
export const fetchWithoutToken = async (url, options = {}) => {
	// Send requests to api url
	const urlRoute = handleUrlString(url);

	const optionsWithToken = {
		...options,
		headers: { ...options.headers},
	};
	try {
		const response = await fetch(urlRoute, optionsWithToken);
		return response;
	} catch {
		return { status: 400, message: `Failed to Fetch Data. Something Went Wrong. Check your network connection.` }
	}
};

export default fetchWithToken

export const handleUrlString = (input) => {
	let url;
	if (input.startsWith("/")){
		url = input.slice(1);
	}else{
		url= input
	}
	return process.env.REACT_APP_API_URL +"/"+ url;
}


