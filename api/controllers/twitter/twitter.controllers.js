const SocialMediaTokenModel = require("../../models/SocialMediaToken.model");
const generateCodeChallenge = require("../../helpers/generateCodeChallenge");
const generateCodeVerifier = require("../../helpers/generateCodeVerifier");
const generateState = require("../../helpers/generateState");

const moment = require("moment");
const {
	getTwitterTokens,
	getTwitterUserInfo,
	revokeTwitterToken,
} = require("../../services/twitter.services");

let codeVerifier;

// Twitter controllers
exports.authorizeTwitterLink = (req, res, next) => {
	codeVerifier = generateCodeVerifier();
	const codeChallenge = generateCodeChallenge(codeVerifier);

	const state = generateState();
	const stateWithUserId = `${state}:${req.body.userId}`; // Pass the userId in the state

	const url =
		`${process.env.TWITTER_AUTH_URL}?` +
		`response_type=code` +
		`&client_id=${encodeURIComponent(process.env.TWITTER_CLIENT_ID)}` +
		`&redirect_uri=${encodeURIComponent(process.env.TWITTER_CALLBACK_URL)}` +
		`&state=${encodeURIComponent(stateWithUserId)}` +
		`&code_challenge=${encodeURIComponent(codeChallenge)}` +
		`&scope=${encodeURIComponent(process.env.TWITTER_SCOPES)}` +
		`&code_challenge_method=${process.env.TWITTER_CHALLENGE_CODE_METHOD}`;

	res.redirect(url);
};

exports.getTwitterTokens = async (req, res, next) => {
	const date = moment();
	const { code, state } = req.query;
	const userId = state.split(":")[1]; // Getting the userId
	const codeVerifierr = codeVerifier;

	if (!code || !state) {
		return res
			.status(403)
			.send({ error: true, message: "Access denied or session expired" });
	}

	try {
		const tokensData = await getTwitterTokens(code, codeVerifierr);
		const userData = await getTwitterUserInfo(tokensData.access_token);

		codeVerifier = null;

		SocialMediaTokenModel.findOne({ userId: userId })
			.then((match) => {
				if (!match) {
					new SocialMediaTokenModel({
						userId: userId,
						twitter: {
							twitterId: userData.id,
							twitterProfilPic: userData.profile_image_url,
							twitterName: userData.name,
							twitterUsername: "@" + userData.username,
							accessToken: tokensData.access_token,
							accessTokenExpireAt: date.add(
								tokensData.expires_in === 7200 ? "2" : "",
								"h"
							),
							refreshToken: tokensData.refresh_token,
						},
					})
						.save()
						.then(() => {
							// In the future will redirect to the frontend
							return res.status(201).send({
								error: false,
								message: "Ce compte Twitter a été lié à Arya avec succès",
							});
						})
						.catch((err) => res.status(500).send(err));
				} else if (match.twitter.accessToken === undefined) {
					SocialMediaTokenModel.findOneAndUpdate(
						{ userId: userId },
						{
							$set: {
								twitter: {
									accessToken: tokensData.access_token,
									twitterId: userData.id,
									twitterProfilPic: userData.profile_image_url,
									twitterName: userData.name,
									twitterUsername: "@" + userData.username,
									accessTokenExpireAt: date.add(
										tokensData.expires_in === 7200 ? "2" : "",
										"h"
									),
									refreshToken: tokensData.refresh_token,
								},
							},
						},
						{ upsert: true, new: true, setDefaultsOnInsert: true }
					)
						.then(() => {
							// In the future will redirect to the frontend
							return res.status(201).send({
								error: false,
								message: "Ce compte Twitter a été lié à Arya avec succès",
							});
						})
						.catch((err) => res.status(500).send(err));
				} else {
					return res.status(400).send({
						error: true,
						message: "Ce compte Twitter est déjà lié à Arya",
					});
				}
			})
			.catch((err) => res.status(500).send(err));
	} catch (err) {
		return res.status(parseInt(err.message.split(" ")[5]) || 500).send(err);
	}
};

exports.revokeTwitterTokens = (req, res, next) => {
	SocialMediaTokenModel.findOne({ userId: req.params.id })
		.then(async (tokens) => {
			if (!tokens) {
				return res.status(404).send({
					error: true,
					message: "Aucun compte Twitter n'est lié à ce compte",
				});
			}

			if (tokens.twitter.accessToken === undefined) {
				return res.status(404).send({
					error: true,
					message: "Aucun compte Twitter n'est lié à ce compte",
				});
			}

			const revokeTokenData = await revokeTwitterToken(
				tokens.twitter.accessToken
			);

			if (revokeTokenData.revoked === true) {
				SocialMediaTokenModel.findOneAndUpdate(
					{ userId: req.params.id },
					{
						$unset: {
							twitter: "",
						},
					},
					{
						new: true,
						setDefaultsOnInsert: true,
					}
				)
					.then((updated) => res.status(200).send(updated))
					.catch((err) => res.status(500).send(err));
			}
		})
		.catch((err) =>
			res.status(parseInt(err.message.split(" ")[5]) || 500).send(err)
		);
};
