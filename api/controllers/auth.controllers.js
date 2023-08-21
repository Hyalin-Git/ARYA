// Model
const UserModel = require("../models/user.model");
const UserVerificationModel = require("../models/UserVerification.model");
const RefreshTokenModel = require("../models/RefreshToken.model");
// Libraries
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
// Utils
const { sendEmail } = require("../utils/mail/nodeMailer");
const { generateAccessToken } = require("../utils/jwt/generateAccessToken");
const { generateRefreshToken } = require("../utils/jwt/generateRefreshToken");
const { verifyAccountText } = require("../utils/mail/mailText");
const {
	signUpValidation,
	signInValidation,
} = require("../utils/validation/formValidation");

// SignUp controller
exports.signUp = (req, res, next) => {
	// form validation
	const data = signUpValidation(req);
	// If not valid then return an err with the corresponding field
	if (!data.isValid) {
		return res.status(400).send({ message: data.message });
	}

	// Else hash the password 10 times
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			// Create the user model with the given informations
			const user = new UserModel({
				lastName: req.body.lastName,
				firstName: req.body.firstName,
				userName: "@" + req.body.userName,
				email: req.body.email,
				password: hash,
				phone: req.body.phone,
				dateOfBirth: req.body.dateOfBirth,
				activity: req.body.activity,
			});
			user
				.save()
				.then(async (user) => {
					const generateUniqueToken = crypto.randomBytes(32).toString("hex");
					const uniqueToken = generateUniqueToken;
					const url = `${process.env.CLIENT_URL}/verify/${user._id}/${uniqueToken}`;

					const sent = await sendEmail(
						user.email,
						"Vérification de votre adresse e-mail",
						verifyAccountText(user, url)
					);

					if (!sent) {
						return res.status(500).send({
							error: true,
							message: "Une erreur est survenue lors de l'envoie de l'email",
						});
					}

					new UserVerificationModel({
						userId: user._id,
						uniqueToken: uniqueToken,
					})
						.save()
						.then(() => {
							res.status(201).send({
								error: false,
								message: "Un email de vérification a été envoyé !",
							});
						})
						.catch((err) => res.status(500).send(err));
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

// SignIn controller
exports.signIn = (req, res, next) => {
	UserModel.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(404).send({ message: "Adresse mail introuvable" }); // Cloudn't find a corresponding email
			} else {
				// Form validation
				const data = signInValidation(req);
				// If not valid then return an err with the corresponding field
				if (!data.isValid) {
					return res.status(400).send({ message: data.message });
				}

				bcrypt
					.compare(req.body.password, user.password)
					.then((match) => {
						if (!match) {
							return res
								.status(401)
								.send({ message: "Mot de passe incorrect !" }); // Password does not match
						} else {
							const rememberMe = req.body.rememberMe;
							// generate tokens
							const accessToken = generateAccessToken(user);
							const refreshToken = generateRefreshToken(user, rememberMe);

							// Saving a new RefreshToken in the DB
							new RefreshTokenModel({
								userId: user._id,
								token: refreshToken,
							})
								.save()
								.then(() => {
									res.status(201).send({
										userId: user._id,
										isAdmin: user.admin,
										accessToken: accessToken,
										refreshToken: refreshToken,
									});
								})
								.catch((err) => {
									// If the user already has a registered token then update it
									// err.code 11000 = duplicate entry
									if (err.code === 11000) {
										RefreshTokenModel.findOneAndUpdate(
											{ userId: user._id },
											{
												$set: {
													token: refreshToken,
												},
											},
											{ setDefaultsOnInsert: true, new: true }
										)
											.then(() => {
												res.status(200).send({
													userId: user._id,
													isAdmin: user.admin,
													accessToken: accessToken,
													refreshToken: refreshToken,
												});
											})
											.catch((err) => res.status(500).send(err));
									} else {
										res.status(500).send(err);
									}
								});
						}
					})
					.catch((err) => res.status(506).send(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};

// Logout controller
exports.logout = (req, res, next) => {
	const refreshToken = req.body.token;

	if (!refreshToken) {
		return res
			.status(404)
			.send({ error: true, message: "Refresh token introuvable" }); // Couldn't find a corresponding Refresh token
	}

	RefreshTokenModel.findOne({ token: refreshToken })
		.then((user) => {
			if (user.token !== refreshToken) {
				return res
					.status(403)
					.send({ error: true, message: "Refresh token invalide" }); // Refresh token does not match
			} else {
				RefreshTokenModel.findOneAndDelete({ token: refreshToken })
					.then((deletedToken) => {
						res.set("Authorization", "");
						res.status(200).send(deletedToken);
					})
					.catch((err) => console.log(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};

// Refresh token controller
exports.refreshToken = (req, res, next) => {
	const refreshToken = req.body.token;
	const userId = req.body.userId;

	// Send error if there is no token or userId
	if (!refreshToken) {
		return res
			.status(404)
			.send({ error: true, message: "Refresh token doit être fournit" }); // A refresh token is needed
	}
	if (!userId) {
		return res
			.status(404)
			.send({ error: true, message: "Utilisateur doit être fournit" }); // An userId is needed
	}

	RefreshTokenModel.findOne({ userId: userId })
		.then((userToken) => {
			if (!userToken) {
				return res.status(404).send({
					error: true,
					message: "Aucun token lié à cet utilisateur n'a été trouvé", // No token linked to this user was found
				});
			}

			if (refreshToken !== userToken.token) {
				return res.status(506).send({
					error: true,
					message:
						"Le refresh token fournit ne correspond pas à celui qui est enregistré",
				});
			}

			jwt.verify(
				refreshToken,
				`${process.env.REFRESH_TOKEN}`,
				(err, decodedToken) => {
					if (err) {
						// Checks if the refresh token expired
						if (err.name === "TokenExpiredError") {
							// If yes then delete it from the DB
							RefreshTokenModel.findOneAndDelete({ userId: userId })
								.then(() => {
									res.status(403).send({
										error: true,
										message: "Refresh token expiré", // Refresh token expired
									});
								})
								.catch((err) => res.status(500).send(err));
						} else {
							return res.status(403).send({
								error: true,
								message: "Refresh token invalide",
							}); // Refresh token does not match
						}
					} else {
						// If there is no err, we are checking if the user existing in the DB
						if (decodedToken) {
							UserModel.findById({ _id: decodedToken.userId })
								.then((user) => {
									// If an user has been found then generate the access token
									const newAccessToken = generateAccessToken(user);

									res.status(200).send({
										newAccessToken: newAccessToken,
									});
								})
								.catch((err) => res.status(500).send(err));
						}
					}
				}
			);
		})
		.catch((err) => res.status(500).send(err));
};
