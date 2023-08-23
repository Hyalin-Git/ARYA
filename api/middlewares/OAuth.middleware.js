const SocialMediaTokenModel = require("../models/SocialMediaToken.model");
const moment = require("moment");
const {
	refreshTwitterTokens,
	getTwitterUserInfo,
} = require("../services/twitter.services");

exports.OAuthTwitter = (req, res, next) => {
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
					const refreshTokensData = await refreshTwitterTokens(
						tokens.twitter.refreshToken
					);

					const userData = await getTwitterUserInfo(
						refreshTokensData.access_token
					);

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
					return res.status(500).send({ error: true, message: err });
				}
			} else {
				next();
			}
		})
		.catch((err) => res.status(500).send(err));
};
