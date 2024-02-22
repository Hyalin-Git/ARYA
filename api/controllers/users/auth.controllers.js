// Model
const UserModel = require("../../models/users/User.model");
const UserVerificationModel = require("../../models/verifications/UserVerification.model");
const RefreshTokenModel = require("../../models/users/RefreshToken.model");
// Libraries
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
// Utils
const { sendEmail } = require("../../utils/mail/nodeMailer");
const { generateAccessToken } = require("../../utils/jwt/generateAccessToken");
const {
	generateRefreshToken,
} = require("../../utils/jwt/generateRefreshToken");
const { verifyAccountText } = require("../../utils/mail/mailText");
const {
	signUpValidation,
	signInValidation,
	freelanceValidation,
} = require("../../helpers/formValidation");
const otp = require("otpauth");
const qrcode = require("qrcode");
const CompanyModel = require("../../models/company/Company.model");
const { uploadFile } = require("../../helpers/cloudinaryManager");
const FreelanceModel = require("../../models/users/Freelance.model");

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
			});
			user
				.save()
				.then(async (user) => {
					const isCompany = req.body.accountType === "company";
					const isFreelance = req.body.accountType === "freelance";

					// Needs to create freelance or company

					if (isCompany) {
						try {
							const { logo } = req.files;

							const uploadResponse = logo
								? await uploadFile(logo[0], "logo")
								: "";

							const company = new CompanyModel({
								leaderId: user._id,
								name: req.body.name,
								logo: uploadResponse,
								activity: req.body.activity,
								lookingForEmployees: req.body.lookingForEmployees,
							});

							await company.save();
						} catch (err) {
							console.log(err);
						}
					}
					if (isFreelance) {
						try {
							const { cv } = req.files;

							const uploadResponse = cv ? await uploadFile(cv[0], "cv") : "";

							const freelance = new FreelanceModel({
								userId: user._id,
								cv: uploadResponse,
								portfolio: req.body.portfolio,
								activity: req.body.activity,
								lookingForJob: req.body.lookingForJob,
							});

							await freelance.save();
						} catch (err) {
							console.log(err);
						}
					}

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
								.send({ message: "Mot de passe incorrect" }); // Password does not match
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
	const refreshToken = req.body.refreshToken;
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

									const cookies = cookie.serialize(
										"session_id",
										`${user._id}`,
										{
											httpOnly: true,
											maxAge: 48 * 60 * 60, // 48 hours,
											secure: true,
											sameSite: true,
										}
									);

									res.setHeader("Set-Cookie", cookies);

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

// 2FA

exports.generateOTP = (req, res, next) => {
	const { userId } = req.body;

	const ramdomHex = crypto.randomBytes(15).toString("hex");
	// Generate a random secret based on the randomHex
	otp.Secret.fromHex(ramdomHex);

	UserModel.findById({ _id: userId })
		.then(async (user) => {
			if (!user) {
				return res.status(404).send({
					error: true,
					message: "Couldn't find any corresponding user",
				});
			}

			let totp = new otp.TOTP({
				issuer: "http://localhost:3000",
				label: "Arya",
				algorithm: "SHA1",
				digits: 6,
			});

			let otpauthUrl = totp.toString();

			await UserModel.findByIdAndUpdate(
				{ _id: userId },
				{
					$set: {
						twoFactor: {
							otp_hex: otpauthUrl.split("secret=")[1].split("&")[0],
							otp_enabled: false,
							otp_verified: false,
						},
					},
				},
				{ new: true, setDefaultsOnInsert: true }
			);

			qrcode.toDataURL(otpauthUrl, (err, data_url) => {
				if (err) {
					return res.status(500).send("Error generating QR code");
				}
				res.status(201).send(`<img src="${data_url}" alt="QR Code"/>`);
			});
		})
		.catch((err) => res.status(500).send(err));
};

exports.activateOTP = (req, res, next) => {
	const { userId, otpToken } = req.body;

	UserModel.findById({ _id: userId })
		.then((user) => {
			if (!user) {
				return res.status(404).send({
					error: true,
					message: "Couldn't find any corresponding user",
				});
			}

			let totp = new otp.TOTP({
				issuer: "http://localhost:3000",
				label: "Arya",
				algorithm: "SHA1",
				digits: 6,
				secret: user.twoFactor.otp_hex,
			});

			let isValid = totp.validate({ token: otpToken });

			if (isValid !== 0) {
				return res.status(401).send({
					error: true,
					message: "2FA Validation failed",
				});
			}

			UserModel.findByIdAndUpdate(
				{ _id: userId },
				{
					$set: {
						twoFactor: {
							otp_hex: user.twoFactor.otp_hex,
							otp_enabled: true,
							otp_verified: true,
						},
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			)
				.then((updated) => res.status(200).send(updated))
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

exports.validateOTP = (req, res, next) => {
	const { userId, otpToken } = req.body;

	UserModel.findById({ _id: userId })
		.then((user) => {
			if (!user) {
				return res.status(404).send({
					error: true,
					message: "Couldn't find any corresponding user",
				});
			}

			if (user.twoFactor.otp_verified === false) {
				return res.status(401).send({
					error: true,
					message: "2FA is not Verified",
				});
			}

			let totp = new otp.TOTP({
				issuer: "http://localhost:3000",
				label: "Arya",
				algorithm: "SHA1",
				digits: 6,
				secret: user.twoFactor.otp_hex,
			});

			let isValid = totp.validate({ token: otpToken });

			if (isValid !== 0) {
				return res.status(401).send({
					error: true,
					message: "2FA Validation failed",
				});
			}

			return res.status(200).send({ error: false, OTPAuth: true });
		})
		.catch((err) => res.status(500).send(err));
};

exports.disableOTP = (req, res, next) => {
	const { userId } = req.body;

	UserModel.findById({ _id: userId })
		.then((user) => {
			if (!user) {
				return res.status(404).send({
					error: true,
					message: "Couldn't find any corresponding user",
				});
			}
			UserModel.findByIdAndUpdate(
				{ _id: userId },
				{
					$set: {
						twoFactor: {
							otp_hex: user.twoFactor.otp_hex,
							otp_enabled: false,
							otp_verified: true,
						},
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			)
				.then((updated) => res.status(200).send(updated))
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteOTP = (req, res, next) => {
	const { userId } = req.body;

	UserModel.findById({ _id: userId })
		.then((user) => {
			if (!user) {
				return res.status(404).send({
					error: true,
					message: "Couldn't find any corresponding user",
				});
			}
			UserModel.findByIdAndUpdate(
				{ _id: userId },
				{
					$unset: {
						twoFactor: {},
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			)
				.then((updated) => res.status(200).send(updated))
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};
