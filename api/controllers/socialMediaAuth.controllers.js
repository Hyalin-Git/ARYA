const crypto = require("crypto");
const {
	generateCodeVerifier,
	generateCodeChallenge,
} = require("../utils/OAuth2ChallengeGenerator/challengeGenerator");
const axios = require("axios");
const SocialMediaTokenModel = require("../models/SocialMediaToken.model");

// Twitter controllers

let temporaryCodeVerifier;

exports.authorizeTwitter = (req, res, next) => {
	const userId = req.body.userId;
	function generateState() {
		const state = crypto.randomBytes(16).toString("hex");
		return state;
	}

	temporaryCodeVerifier = generateCodeVerifier();
	const codeChallenge = generateCodeChallenge(temporaryCodeVerifier);
	const state = generateState();
	const stateWithUserId = `${state}:${userId}`; // Pass the userId in the state

	const url =
		`${process.env.TWITTER_AUTH_URL}?` +
		`response_type=code` +
		`&client_id=${encodeURIComponent(process.env.TWITTER_CLIENT_ID)}` +
		`&redirect_uri=${encodeURIComponent(process.env.TWITTER_CALLBACK_URL)}` +
		`&scope=${encodeURIComponent(process.env.TWITTER_SCOPES)}` +
		`&state=${encodeURIComponent(stateWithUserId)}` +
		`&code_challenge=${encodeURIComponent(codeChallenge)}` +
		`&code_challenge_method=${process.env.TWITTER_CHALLENGE_CODE_METHOD}`;

	res.redirect(url);
};
//${encodeURIComponent(codeChallenge)}//
exports.getTwitterTokens = (req, res, next) => {
	const code = req.query.code;
	const state = req.query.state;
	const userId = state.split(":")[1]; // Getting the userId
	const codeVerifier = temporaryCodeVerifier;

	return axios({
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
	})
		.then((data) => {
			temporaryCodeVerifier = null;
			if (!data) {
				res.status(400).send({
					error: true,
					message: "Une erreur s'est produite lors de l'association du compte.",
				});
			}

			SocialMediaTokenModel.findOne({ userId: userId })
				.then((match) => {
					if (!match) {
						new SocialMediaTokenModel({
							userId: userId,
							twitter: {
								accessToken: data.data.access_token,
								refreshToken: data.data.refresh_token,
							},
						})
							.save()
							.then((LinkedMedia) => {
								res.status(200).send({
									error: false,
									message: "Ce compte Twitter a été lié à Arya avec succès",
									data: LinkedMedia,
								});
							})
							.catch((err) => res.status(500).send(err));
					} else {
						res.status(400).send({
							error: true,
							message: "Ce compte Twitter est déjà lié à Arya",
						});
					}
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

exports.refreshTwitterToken = (req, res, next) => {
	const userId = req.body.userId;

	SocialMediaTokenModel.findOne({ userId: userId })
		.then((tokens) => {
			if (!tokens) {
				return res.status(404).send({
					error: true,
					message: "Aucun compte Twitter n'est lié à ce compte",
				});
			}
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
									refreshToken: data.data.refresh_token,
								},
							},
						},
						{
							upsert: true,
							setDefaultsOnInsert: true,
						}
					)
						.then((updated) => res.status(200).send(updated))
						.catch((err) => console.log(err));
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => res.status(500).send(err));
};

exports.revokeTokens = (req, res, next) => {
	const userId = req.body.userId;

	SocialMediaTokenModel.findOne({ userId: userId })
		.then((tokens) => {
			if (!tokens) {
				return res.status(404).send({
					error: true,
					message: "Aucun compte Twitter n'est lié à ce compte",
				});
			}
			return axios({
				method: "POST",
				url: `${process.env.TWITTER_URL}/revoke`,
				withCredentials: true,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				data: {
					token_type_hint: "access_token",
					token: `${tokens.twitter.accessToken}`,
					client_id: `${process.env.TWITTER_CLIENT_ID}`,
				},
			})
				.then((data) => {
					if (data.data.revoked === true) {
						SocialMediaTokenModel.findOneAndUpdate(
							{ userId: userId },
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
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};
