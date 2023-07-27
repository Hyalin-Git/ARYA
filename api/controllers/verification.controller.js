const ResetPasswordModel = require("../models/ResetPassword.model");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendEmail } = require("../middlewares/nodeMailer.middleware");
const UserVerificationModel = require("../models/UserVerification.model");
const ResetEmailModel = require("../models/ResetEmail.model");

// Email verification //

// Checks user's email
exports.verifyLink = (req, res, next) => {
	if (!req.query.q) {
		return res.status(400).send({
			error: true,
			message:
				"Requête incomplète : Certains paramètres obligatoires sont manquants dans la requête",
		});
	}

	if (req.query.q === "email") {
		UserModel.findById({ _id: req.params.id })
			.then((user) => {
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
								UserVerificationModel.findOneAndDelete()
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
	}
	if (req.query.q === "newEmail") {
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
	}
};

// Send a new email if the user isn't verified
exports.checkUserVerification = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((user) => {
			if (!user) {
				return res.status(404).send("Cet utilisateur n'existe pas"); // This user does not exist
			}

			// If the corresponding user isn't verified send an email
			if (!user.verified) {
				UserVerificationModel.findOne({ userId: user._id }).then((data) => {
					if (data) {
						return res.status(400).send({
							error: true,
							message: "Un email a déjà été envoyé", // An email has already been sent
						});
					}
					const generateToken = crypto.randomBytes(32).toString("hex");
					const uniqueToken = generateToken;
					const url = `${process.env.CLIENT_URL}/users/${user._id}/verify/${uniqueToken}`;
					sendEmail(user.email, "Verify Email", url)
						.then((sent) => {
							if (!sent) {
								return res.status(400).send({
									error: false,
									message: "L'envoie de l'email a échoué", // Couldn't send the email
								});
							}
							const token = new UserVerificationModel({
								userId: user._id,
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
				});
			} else {
				res.status(200).send({
					error: false,
					message: "Votre compte est déjà vérifié", // Your account has already been verified
				});
			}
		})
		.catch((err) => res.status(500).send(err));
};

// Verify the reset code to update the password
exports.verifyResetCode = (req, res, next) => {
	const resetCode = req.body.resetCode;

	ResetPasswordModel.findOne({
		userEmail: req.body.userEmail,
		resetCode: resetCode,
	})
		.then((data) => {
			if (!data) {
				return res
					.status(200)
					.send({ message: "Le code fournit est expiré ou invalide !" });
			}

			ResetPasswordModel.findOneAndUpdate(
				{ userEmail: req.body.userEmail },
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
