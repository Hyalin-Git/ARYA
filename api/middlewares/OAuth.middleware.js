const SocialMediaTokenModel = require("../models/SocialMediaToken.model");
const axios = require("axios");
const moment = require("moment");

exports.OAuthTokensHandler = (req, res, next) => {
	let date = moment();
	const userId = req.body.userId || req.body.posterId;

	SocialMediaTokenModel.findOne({ userId: userId })
		.then((tokens) => {
			if (!tokens) {
				return res.status(404).send({
					error: true,
					message: "Aucun compte Twitter n'est lié à ce compte",
				});
			}

			const expireTime = tokens.twitter.expireTime;

			if (date.isSameOrAfter(moment(expireTime))) {
				return axios({
					method: "POST",
					url: `${process.env.TWITTER_URL}/token`,
					withCredentials: true,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					data: {
						refresh_token: `${tokens.twitter.refreshToken}`,
						grant_type: "refresh_token",
						client_id: `${process.env.TWITTER_CLIENT_ID}`,
					},
				})
					.then((data) => {
						SocialMediaTokenModel.findOneAndUpdate(
							{ userId: userId },
							{
								$set: {
									twitter: {
										accessToken: data.data.access_token,
										expireTime: date.add(
											data.data.expires_in === 7200 ? "2" : "",
											"h"
										),
										refreshToken: data.data.refresh_token,
									},
								},
							},
							{
								upsert: true,
								setDefaultsOnInsert: true,
							}
						)
							.then((updated) => {
								if (updated) {
									next();
								}
							})
							.catch((err) => console.log(err));
					})
					.catch((err) => console.log(err));
			} else {
				next();
			}
		})
		.catch((err) => res.status(500).send(err));
};
