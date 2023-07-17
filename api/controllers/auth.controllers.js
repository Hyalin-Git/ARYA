const UserModel = require("../models/user.model");
const UserToken = require("../models/UserToken.model");
const UserVerification = require("../models/UserVerification.model");
const { regex } = require("../utils/regex");
const { sendEmail } = require("../middlewares/nodeMailer.middleware");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Generate a random jwt secret key
// const jwtSecretKey = crypto.randomBytes(32).toString("hex");

// SignUp logic
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

	if (isValid === false) {
		return res.status(400).send({ message: message });
	}

	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
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
							res.status(201).send({ Utilisateur: user, Token: token });
						})
						.catch((err) => res.status(500).send(err));
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

const generateAccessToken = (user) => {
	return jwt.sign(
		{
			userId: user._id,
			isAdmin: user.admin,
		},
		`${process.env.ACCESS_TOKEN}`,
		{ expiresIn: "30s" }
	);
};
const generateRefreshToken = (user, saveRefreshToken) => {
	console.log(saveRefreshToken);
	return jwt.sign(
		{
			userId: user._id,
			isAdmin: user.admin,
		},
		`${process.env.REFRESH_TOKEN}`,
		{ expiresIn: "30d" }
	);
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
							const saveRefreshToken = req.body.save;
							// generate tokens
							const accessToken = generateAccessToken(user);
							const refreshToken = generateRefreshToken(user, saveRefreshToken);

							// check if the user already have a token
							UserToken.findOne({ userId: user._id })
								.then((token) => {
									// if not then create a new one
									if (!token) {
										new UserToken({
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
											.catch((err) => res.status(500).send(err));
									} else {
										// else find it and then update it
										UserToken.findOneAndUpdate(
											{ userId: user._id },
											{
												$set: {
													token: refreshToken,
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
									}
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
			.send({ error: true, message: "Refresh token introuvable" }); // Couldn't find a corresponding refresh token
	}

	UserToken.findOne({ token: refreshToken })
		.then((user) => {
			if (user.token !== refreshToken) {
				return res
					.status(403)
					.send({ error: true, message: "Refresh token invalide" }); // Refresh token does not match
			} else {
				UserToken.findOneAndDelete({ token: refreshToken })
					.then((deletedToken) => {
						res.status(200).send(deletedToken);
					})
					.catch((err) => console.log(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};

exports.refreshToken = (req, res, next) => {
	// Take the refresh token from the user
	const refreshToken = req.body.token;
	// send error if there is no token
	if (!refreshToken) {
		return res
			.status(404)
			.send({ error: true, message: "Refresh token introuvable" }); // Couldn't find a corresponding refresh token
	}

	UserToken.findOne({ userId: req.body.userId })
		.then((user) => {
			if (!user) {
				return res.sendStatus(404);
			} else {
				jwt.verify(
					refreshToken,
					`${process.env.REFRESH_TOKEN}`,
					(err, decodedToken) => {
						if (err) {
							return res
								.status(403)
								.send({ error: true, message: "Refresh token invalide" }); // Refresh token does not match
						}
						// send error if refresh token is invalid
						if (user.token !== refreshToken) {
							return res
								.status(403)
								.send({ error: true, message: "Refresh token invalide" });
						} else {
							if (decodedToken) {
								// else, find the user
								UserModel.findById({ _id: decodedToken.userId })
									.then((user) => {
										// if an user has been found then generate the tokens
										const newAccessToken = generateAccessToken(user);
										const newRefreshToken = generateRefreshToken(user);
										// Then, find the token of the corresponding user
										UserToken.findOneAndUpdate(
											{ userId: user._id },
											{
												$set: {
													token: newRefreshToken, // Update the token
												},
											},
											{ setDefaultsOnInsert: true }
										)
											.then(() =>
												res.status(200).send({
													accessToken: newAccessToken,
													newRefreshToken: newRefreshToken,
												})
											)
											.catch((err) => res.status(500).send(err));
									})
									.catch((err) => res.status(500).send(err));
							}
						}
					}
				);
			}
		})
		.catch((err) => res.status(500).send(err));
};
