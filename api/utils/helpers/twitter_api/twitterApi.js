const axios = require("axios");

const getTokens = async (code, codeVerifier) => {
	try {
		const response = await axios({
			method: "POST",
			url: `${process.env.TWITTER_URL}/token`,
			withCredentials: true,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			data: {
				code: code,
				grant_type: "authorization_code",
				client_id: `${process.env.TWITTER_CLIENT_ID}`,
				redirect_uri: `${process.env.TWITTER_CALLBACK_URL}`,
				code_verifier: `${codeVerifier}`,
			},
		});
		return response.data;
	} catch (err) {
		throw err;
	}
};

const getUserInfo = async (accessToken) => {
	try {
		const response = await axios({
			method: "GET",
			url: `${process.env.TWITTER_AUTH_INFO_URL}?user.fields=profile_image_url`,
			withCredentials: true,
			headers: {
				// Pass the access_token in the header
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return response.data.data;
	} catch (err) {
		throw err;
	}
};

const refreshTokens = async (refreshToken) => {
	try {
		const response = await axios({
			method: "POST",
			url: `${process.env.TWITTER_URL}/token`,
			withCredentials: true,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			data: {
				refresh_token: `${refreshToken}`,
				grant_type: "refresh_token",
				client_id: `${process.env.TWITTER_CLIENT_ID}`,
			},
		});
		return response.data;
	} catch (err) {
		throw err;
	}
};

const revokeToken = async (accessToken) => {
	try {
		const response = await axios({
			method: "POST",
			url: `${process.env.TWITTER_URL}/revoke`,
			withCredentials: true,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			data: {
				token_type_hint: "access_token",
				token: `${accessToken}`,
				client_id: `${process.env.TWITTER_CLIENT_ID}`,
			},
		});
		return response.data;
	} catch (err) {
		throw err;
	}
};

const sendTweets = async (accessToken, text) => {
	try {
		const response = await axios({
			method: "POST",
			url: `${process.env.TWITTER_MANAGE_TWEETS_URL}`,
			withCredentials: true,
			headers: {
				// Pass the access_token in the header
				Authorization: `Bearer ${accessToken}`,
			},
			data: {
				text: text,
			},
		});
		return response.data;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	getTokens,
	getUserInfo,
	refreshTokens,
	revokeToken,
	sendTweets,
};
