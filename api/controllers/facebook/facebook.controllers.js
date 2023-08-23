const SocialMediaTokenModel = require("../../models/SocialMediaToken.model");
const generateCodeChallenge = require("../../helpers/generateCodeChallenge");
const generateCodeVerifier = require("../../helpers/generateCodeVerifier");
const generateState = require("../../helpers/generateState");
const {
	getTokensFacebook,
	getFacebookUserInfo,
	refreshFacebookToken,
} = require("../../services/facebook.services");
const moment = require("moment");

// Facebook controllers

exports.authorizeFacebookLink = (req, res, next) => {
	codeVerifier = generateCodeVerifier();
	const codeChallenge = generateCodeChallenge(codeVerifier);

	const state = generateState();
	const stateWithUserId = `${state}:${req.body.userId}`;

	const url =
		`${process.env.FACEBOOK_AUTH_URL}` +
		`?response_type=code` +
		`&client_id=${encodeURIComponent(process.env.FACEBOOK_CLIENT_ID)}` +
		`&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_CALLBACK_URL)}` +
		`&code=${encodeURIComponent(codeChallenge)}` +
		`&state=${encodeURIComponent(stateWithUserId)}`;

	res.redirect(url);
};

exports.getFacebookTokens = async (req, res, next) => {
	const date = moment();
	const { code, state } = req.query;
	const userId = state.split(":")[1];

	if (!code || !state) {
		return res
			.status(403)
			.send({ error: true, message: "Access denied or session expired" });
	}

	try {
		const tokensData = await getTokensFacebook(code);
		const userData = await getFacebookUserInfo(tokensData.access_token);
		console.log(tokensData);

		SocialMediaTokenModel.findOne({ userId: userId })
			.then((match) => {
				if (!match) {
					new SocialMediaTokenModel({
						userId: userId,
						facebook: {
							facebookId: userData.id,
							facebookProfilPic: userData.picture.data.url,
							facebookName: userData.name,
							accessToken: tokensData.access_token,
							accessTokenExpireAt: date.add(
								tokensData.expires_in.toString(),
								"seconds"
							),
						},
					})
						.save()
						.then(() => {
							// In the future will redirect to the frontend
							return res.status(201).send({
								error: false,
								message: "Ce compte Facebook a été lié à Arya avec succès",
							});
						})
						.catch((err) => res.status(500).send(err));
				} else if (match.facebook.accessToken === undefined) {
					SocialMediaTokenModel.findOneAndUpdate(
						{ userId: userId },
						{
							$set: {
								facebook: {
									facebookId: userData.id,
									facebookProfilPic: userData.picture.data.url,
									facebookName: userData.name,
									accessToken: tokensData.access_token,
									accessTokenExpireAt: date.add(
										tokensData.expires_in.toString(),
										"seconds"
									),
								},
							},
						},
						{ upsert: true, new: true, setDefaultsOnInsert: true }
					)
						.then(() =>
							res.status(201).send({
								error: false,
								message: "Ce compte Facebook a été lié à Arya avec succès",
							})
						)
						.catch((err) => res.status(500).send(err));
				} else {
					return res.status(400).send({
						error: true,
						message: "Ce compte Facebook est déjà lié à Arya",
					});
				}
			})
			.catch((err) => res.status(500).send(err));
	} catch (err) {
		return res.status(parseInt(err.message.split(" ")[5]) || 500).send(err);
	}
};

exports.facebookRefresh = async (req, res, next) => {
	SocialMediaTokenModel.findOne({ userId: req.body.userId })
		.then(async (find) => {
			const refreshData = await refreshFacebookToken(find.facebook.accessToken);
			console.log(refreshData);
		})
		.catch((err) => res.status(500).send(err));
};
