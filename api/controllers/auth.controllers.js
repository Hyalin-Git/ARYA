const UserModel = require("../models/user.model");
const RefreshToken = require("../models/RefreshToken.model");
const UserVerification = require("../models/UserVerification.model");
const { regex } = require("../utils/regex");
const { sendEmail } = require("../middlewares/nodeMailer.middleware");
const { generateAccessToken } = require("../utils/generateAccessToken");
const { generateRefreshToken } = require("../utils/generateRefreshToken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Basic auth controller

exports.signUp = (req, res, next) => {
	// form validation
	let isValid = true;
	let message = "";

	switch (false) {
		case regex.names.test(req.body.lastName || req.body.firstName):
			isValid = false;
			// Names are invalid
			message = "Votre nom ou prénom est invalide";
			break;
		case regex.email.test(req.body.email):
			isValid = false;
			// Email is invalid
			message = "Votre adresse mail est invalide";
			break;
		case regex.password.test(req.body.password):
			isValid = false;
			// Password should contain at least 8 character, 1 number, 1 uppercase, 1 lowercase
			message =
				"Votre mot de passe doit contenir 8 caractères, 1 chiffre, une majuscule, une minuscule";
			break;
		case regex.phone.test(req.body.phone):
			isValid = false;
			// Phone is invalid
			message = "Votre numéro de téléphone est invalide";
			break;
		case regex.dateOfBirth.test(req.body.dateOfBirth):
			isValid = false;
			// Date of birth is invalid
			message = "Votre date de naissance n'est pas valide";
			break;
		default:
			// Please fill in the form fields
			message = "Veuillez remplir les champs du formulaire";
	}

	// If one of those case set false to isValid, then return this err
	if (isValid === false) {
		return res.status(400).send({ message: message });
	}
	// Else salt the password 10 times
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			// Create the user model with the given informations
			const user = new UserModel({
				lastName: req.body.lastName,
				firstName: req.body.firstName,
				email: req.body.email,
				password: hash,
				phone: req.body.phone,
				dateOfBirth: req.body.dateOfBirth,
				activity: req.body.activity,
			});
			user
				.save()
				.then((user) => {
					const token = new UserVerification({
						userId: user._id,
						uniqueToken: crypto.randomBytes(32).toString("hex"),
					});
					token
						.save()
						.then((token) => {
							const url = `${process.env.CLIENT_URL}/users/${user._id}/verify/${token.uniqueToken}`;

							sendEmail(user.email, "Verify Email", url);
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

exports.signIn = (req, res, next) => {
	UserModel.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(404).send({ message: "Adresse mail introuvable" }); // Cloudn't find a corresponding email
			} else {
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

							// Salt the refreshToken 10 times
							bcrypt
								.hash(refreshToken, 10)
								.then((hashedToken) => {
									// Saving a new RefreshToken in the DB
									new RefreshToken({
										userId: user._id,
										token: hashedToken,
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
												RefreshToken.findOneAndUpdate(
													{ userId: user._id },
													{
														$set: {
															token: hashedToken,
														},
													},
													{ setDefaultsOnInsert: true }
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
								})
								.catch((err) => res.status(500).send(err));
						}
					})
					.catch((err) => res.status(506).send(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};

exports.logout = (req, res, next) => {
	const refreshToken = req.body.token;

	if (!refreshToken) {
		return res
			.status(404)
			.send({ error: true, message: "Refresh token introuvable" }); // Couldn't find a corresponding Refresh token
	}

	RefreshToken.findOne({ token: refreshToken })
		.then((user) => {
			if (user.token !== refreshToken) {
				return res
					.status(403)
					.send({ error: true, message: "Refresh token invalide" }); // Refresh token does not match
			} else {
				RefreshToken.findOneAndDelete({ token: refreshToken })
					.then((deletedToken) => {
						res.set("Authorization", "");
						res.status(200).send(deletedToken);
					})
					.catch((err) => console.log(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};

// Side auth controllers

// Checks user's email
exports.verifyLink = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((user) => {
			if (!user) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun utilisateur trouvé" }); // No users found
			}

			UserVerification.findOne({
				userId: user._id,
				uniqueToken: req.params.token,
			})
				.then((token) => {
					if (!token) {
						return res
							.status(404)
							.send({ error: true, message: "Lien invalide" }); // Invalid link
					}
					// If a model has been found with the given token and userId then update the verified property of the user
					UserModel.findByIdAndUpdate(
						{ _id: user._id },
						{
							$set: {
								verified: true,
							},
						},
						{
							new: true,
							setDefaultsOnInsert: true,
						}
					)
						.then(() => {
							// verified has been updated then delete corresponding UserVerification model in the DB
							UserVerification.findOneAndDelete()
								.then(() =>
									res.status(200).send({
										error: false,
										message: "Email vérifié avec succès", // Email successfully verified
									})
								)
								.catch((err) => res.status(500).send(err));
						})
						.catch((err) => res.status(500).send(err));
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

// Refresh the access token
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

	RefreshToken.findOne({ userId: userId })
		.then((userToken) => {
			if (!userToken) {
				return res.status(404).send({
					error: true,
					message: "Aucun token lié à cet utilisateur n'a été trouvé", // No token linked to this user was found
				});
			} else {
				bcrypt
					.compare(refreshToken, userToken.token)
					.then((match) => {
						if (!match) {
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
										RefreshToken.findOneAndDelete({ userId: userId })
											.then(() => {
												res.status(403).send({
													error: true,
													message: "Refresh token expiré", // Refresh token expired
												});
											})
											.catch((err) => res.status(500).send(err));
									} else {
										return res
											.status(403)
											.send({ error: true, message: "Refresh token invalide" }); // Refresh token does not match
									}
								} else {
									// Else if there no err, we are checking if the user existing in the DB
									if (decodedToken) {
										UserModel.findById({ _id: decodedToken.userId })
											.then((user) => {
												// If an user has been found then generate the access token
												const newAccessToken = generateAccessToken(user);
												// Then, find the token of the corresponding user
												RefreshToken.findOne({ userId: user._id })
													.then(() =>
														res.status(200).send({
															newAccessToken: newAccessToken,
														})
													)
													.catch((err) => res.status(500).send(err));
											})
											.catch((err) => res.status(500).send(err));
									}
								}
							}
						);
					})
					.catch((err) => res.status(500).send(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};
