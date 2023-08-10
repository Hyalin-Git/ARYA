const SocialMediaTokenModel = require("../models/SocialMediaToken.model");
const moment = require("moment");
const {
	refreshTokens,
	getUserInfo,
} = require("../utils/helpers/twitter_api/twitterApi");
const { errorsHandler, statusCodeHandler } = require("../utils/errors/errors");

exports.OAuthTokensHandler = (req, res, next) => {
	let date = moment();
	const userId = req.body.userId || req.body.posterId;

	SocialMediaTokenModel.findOne({ userId: userId })
		.then(async (tokens) => {
			if (!tokens) {
				return res.status(404).send({
					error: true,
					message: "Aucun compte Twitter n'est lié à ce compte",
				});
			}

			const expireTime = tokens.twitter.accessTokenExpireAt;

			if (date.isSameOrAfter(moment(expireTime))) {
				try {
					const refreshTokensData = await refreshTokens(
						tokens.twitter.refreshToken
					);

					const userData = await getUserInfo(refreshTokensData.access_token);

					SocialMediaTokenModel.findOneAndUpdate(
						{ userId: userId },
						{
							$set: {
								twitter: {
									twitterId: userData.id,
									twitterProfilPic: userData.profile_image_url,
									twitterName: userData.name,
									twitterUsername: "@" + userData.username,
									accessToken: refreshTokensData.access_token,
									accessTokenExpireAt: date.add(
										refreshTokensData.expires_in === 7200 ? "2" : "",
										"h"
									),
									refreshToken: refreshTokensData.refresh_token,
								},
							},
						}
					)
						.then(() => next())
						.catch((err) =>
							res.status(500).send({ error: true, message: err })
						);
				} catch (err) {
					const errorMsg = errorsHandler(err);
					const statusCode = statusCodeHandler(err);
					return res
						.status(statusCode)
						.send({ error: true, message: errorMsg });
				}
			} else {
				next();
			}
		})
		.catch((err) => res.status(500).send(err));
};
