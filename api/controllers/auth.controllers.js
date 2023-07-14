const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserToken = require("../models/UserToken.model");

// Generate a random jwt secret key
// const jwtSecretKey = crypto.randomBytes(32).toString("hex");

exports.signUp = (req, res, next) => {
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
				.then((user) => res.status(201).send(user))
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
				return res.status(404).send({ message: "Adresse mail introuvable" });
			} else {
				bcrypt
					.compare(req.body.password, user.password)
					.then((match) => {
						if (!match) {
							return res
								.status(401)
								.send({ message: "Mot de passe incorrect !" });
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
			.send({ error: true, message: "Refresh token introuvable" });
	}

	UserToken.findOne({ token: refreshToken })
		.then((user) => {
			if (user.token !== refreshToken) {
				return res
					.status(403)
					.send({ error: true, message: "Refresh token invalide" });
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
			.send({ error: true, message: "Refresh token introuvable" });
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
								.send({ error: true, message: "Refresh token invalide" });
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
											.catch((err) => console.log(err));
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
