const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserToken = require("../models/UserToken.model");

// Generate a random jwt secret key
// const jwtSecretKey = crypto.randomBytes(32).toString("hex");

// console.log(jwtSecretKey);

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
const generateRefreshToken = (user) => {
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
							const accessToken = generateAccessToken(user);
							const refreshToken = generateRefreshToken(user);

							UserToken.findOne({ userId: user._id })
								.then((token) => {
									if (!token) {
										new UserToken({
											userId: user._id,
											token: refreshToken,
										}).save();
									}
								})
								.catch((err) => console.log(err));

							res.status(200).send({
								userId: user._id,
								isAdmin: user.admin,
								accessToken: accessToken,
								refreshToken: refreshToken,
							});
						}
					})
					.catch((err) => res.status(506).send(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};

exports.refreshToken = (req, res, next) => {
	// Take the refresh token from the user
	const refreshToken = req.body.token;
	// send error if there is no token or it's invalid
	if (!refreshToken) {
		return res.sendStatus(401);
	}

	jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN}`, (err, user) => {
		if (err) {
			return res.sendStatus(403);
		}
		const newAccessToken = generateAccessToken(user);
		const newRefreshToken = generateRefreshToken(user);

		return res
			.status(200)
			.send({ accessToken: newAccessToken, newRefreshToken: newRefreshToken });
	});
	// if everything is ok, create new access token and send to user
};

exports.logout = (req, res, next) => {};
