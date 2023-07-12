const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const JwtKeyModel = require("../models/JwtKey.model");

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
							let jwtSecretKey;
							JwtKeyModel.findOne()
								.then((jwtKey) => {
									if (!jwtKey) {
										jwtSecretKey = crypto.randomBytes(32).toString("hex");
										const jwtModel = new JwtKeyModel({
											secretKey: jwtSecretKey,
										});
										jwtModel
											.save()
											.then((jwtKey) => {
												jwtSecretKey = jwtKey.secretKey;
											})
											.catch((err) => res.status(500).send(err));
									} else {
										jwtSecretKey = jwtKey.secretKey;
									}

									const maxAge = 24 * 60 * 60 * 1000;

									const token = jwt.sign(
										{ userId: user.id },
										`${jwtSecretKey}`,
										{
											expiresIn: maxAge,
										}
									);
									res.cookie("jwt", token, {
										httpOnly: true,
										maxAge: maxAge,
									});
									res.status(200).send({ userId: user._id });
								})
								.catch((err) => res.status(500).send(err));
						}
					})
					.catch((err) => res.status(500).send(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};
