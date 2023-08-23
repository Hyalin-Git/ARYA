const axios = require("axios");

const getTokensFacebook = async (codeVerifier) => {
	try {
		const response = await axios({
			method: "GET",
			url: `https://graph.facebook.com/oauth/access_token
			?client_id=${process.env.FACEBOOK_CLIENT_ID}
			&redirect_uri=${process.env.FACEBOOK_CALLBACK_URL}
			&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}
			&scope=pages_manage_posts
			&code=${codeVerifier}`,
			withCredentials: true,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
		return response.data;
	} catch (err) {
		throw err;
	}
};

async function getFacebookUserInfo(accessToken) {
	try {
		const response = await axios({
			method: "GET",
			url: `https://graph.facebook.com/me?fields=id,name,picture&access_token=${accessToken}`,
			withCredentials: true,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
		return response.data;
	} catch (err) {
		throw err;
	}
}

async function refreshFacebookToken(expiredAccessToken) {
	try {
		const response = await axios({
			method: "GET",
			url: `https://graph.facebook.com/oauth/access_token
			?grant_type=fb_exchange_token
			&client_id=${process.env.FACEBOOK_CLIENT_ID}
			&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}
			&fb_exchange_token=${expiredAccessToken}`,
			withCredentials: true,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return response.data;
	} catch (err) {
		throw err;
	}
}

module.exports = {
	getTokensFacebook,
	getFacebookUserInfo,
	refreshFacebookToken,
};
