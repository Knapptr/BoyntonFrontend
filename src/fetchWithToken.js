const fetchWithToken = async (url, options = {}, auth) => {
	// Send requests to api url
	const urlRoute = handleUrlString(url);

	const optionsWithToken = {
		...options,
		headers: { ...options.headers, authorization: `Bearer ${auth.userData.token}` },
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


