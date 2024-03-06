const ResetPasswordModel = require("../../models/verifications/ResetPassword.model");
const UserModel = require("../../models/users/User.model");
const UserVerificationModel = require("../../models/verifications/UserVerification.model");
const ResetEmailModel = require("../../models/verifications/ResetEmail.model");
const crypto = require("crypto");
const { sendEmail } = require("../../utils/mail/nodeMailer");
const {
	passwordResetLimiter,
} = require("../../middlewares/limiter.middlewares");

// Email verification //

exports.verifyEmailLink = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			if (!user) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun utilisateur trouvé" }); // No users found
			}

			if (user.verified) {
				return res
					.status(400)
					.send({ error: true, message: "Utilisateur déjà vérifié" }); // User's already verified
			}

			UserVerificationModel.findOne({
				userEmail: user.email,
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
							// verified has been updated then delete the corresponding UserVerification model in the DB
							UserVerificationModel.findOneAndDelete({ userEmail: user.email })
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

exports.verifyNewEmailLink = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((user) => {
			if (!user) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun utilisateur trouvé" }); // No users found
			}

			ResetEmailModel.findOne({
				userId: user._id,
				uniqueToken: req.params.token,
			})
				.then((token) => {
					if (!token) {
						return res
							.status(404)
							.send({ error: true, message: "Lien invalide" }); // Invalid link
					}

					if (token.verified) {
						return res
							.status(400)
							.send({ error: true, message: "Lien déjà vérifié" });
					}

					ResetEmailModel.findOneAndUpdate(
						{
							userId: user._id,
							uniqueToken: req.params.token,
						},
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
							UserModel.findByIdAndUpdate(
								{ _id: user._id },
								{
									$set: {
										email: token.userEmail,
									},
								},
								{
									new: true,
									setDefaultsOnInsert: true,
								}
							)
								.then(() =>
									ResetEmailModel.findOneAndDelete()
										.then(() => {
											res.status(200).send({
												error: false,
												message: "Email vérifié et modifié avec succès", // Email successfully verified
											});
										})
										.catch((err) => res.status(500).send(err))
								)
								.catch((err) => res.status(500).send(err));
						})
						.catch((err) => res.status(500).send(err));
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

// Send a new email if the user isn't verified
exports.checkUserVerification = async (req, res, next) => {
	UserModel.findOne({ email: req.body.userEmail })
		.then(async (user) => {
			if (!user) {
				return res.status(404).send("Cet utilisateur n'existe pas"); // This user does not exist
			}

			if (user.verified) {
				return res.status(200).send({
					error: false,
					message: "Votre compte est déjà vérifié", // Your account has already been verified
				});
			}

			const remainingRequests = await passwordResetLimiter.removeTokens(1);

			if (remainingRequests < 0) {
				return res
					.status(429)
					.send({ error: true, message: "Too many requests" });
			}

			// If the corresponding user isn't verified send an email
			UserVerificationModel.findOne({ userEmail: req.body.userEmail })
				.then(async (data) => {
					if (data) {
						await UserVerificationModel.findOneAndDelete({
							userEmail: req.body.userEmail,
						});
					}
					const generateToken = crypto.randomBytes(32).toString("hex");
					const uniqueToken = generateToken;
					const url = `${process.env.CLIENT_URL}/verify/${user._id}/${uniqueToken}`;

					const sent = await sendEmail(user.email, "Verify Email", url);

					if (!sent) {
						return res.status(400).send({
							error: false,
							message: "L'envoie de l'email a échoué", // Couldn't send the email
						});
					}
					const token = new UserVerificationModel({
						userEmail: req.body.userEmail,
						uniqueToken: uniqueToken,
					});
					token
						.save()
						.then((token) =>
							res.status(201).send({
								error: false,
								message: "Un email de vérification a été envoyé !", // A verification email has been sent
								token: token,
							})
						)
						.catch((err) => res.status(500).send(err));
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

// Verify the reset code to update the password
exports.verifyResetCode = (req, res, next) => {
	const resetCode = req.body.resetCode;

	ResetPasswordModel.findOne({
		resetCode: resetCode,
	})
		.then((data) => {
			if (!data) {
				return res
					.status(404)
					.send({ message: "Le code fournit est expiré ou invalide !" });
			}

			ResetPasswordModel.findOneAndUpdate(
				{ resetCode: resetCode },
				{
					$set: {
						verified: true,
					},
				},
				{ new: true }
			)
				.then((data) => res.status(200).send(data))
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};
