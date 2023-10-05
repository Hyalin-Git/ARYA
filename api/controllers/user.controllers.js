const UserModel = require("../models/user.model");
const ResetPasswordModel = require("../models/ResetPassword.model");
const ResetEmailModel = require("../models/ResetEmail.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary.config");
const { sendEmail } = require("../utils/mail/nodeMailer");
const { regex } = require("../utils/RegexPatterns/regex");
const { resetPasswordText, resetEmailText } = require("../utils/mail/mailText");
const { resizeImageAndWebpConvert } = require("../utils/resizeImg");

// Get all users
exports.getUsers = (req, res, next) => {
	UserModel.find()
		.select("-password")
		.then((users) => {
			if (!users) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun utilisateur n'a été trouvé" }); // No users found
			}
			res.status(200).send(users);
		})
		.catch((err) => res.status(500).send(err));
};

// Get one user
exports.getUser = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.select("-password")
		.then((user) => {
			if (!user) {
				return res
					.status(404)
					.send({ error: true, message: "Cet utilisateur n'existe pas" }); // This user does not exist
			}
			res.status(200).send(user);
		})
		.catch((err) => res.status(500).send(err));
};

// Delete one user
exports.deleteOneUser = (req, res, next) => {
	UserModel.findByIdAndDelete({ _id: req.params.id })
		.then((user) => {
			if (!user) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer un utilisateur qui n'existe pas",
				}); // Impossible to delete a non-existent user
			}
			res.status(200).send(user);
		})
		.catch((err) => res.status(500).send(err));
};

// Update user profil picture
exports.updateUserPicture = async (req, res, next) => {
	try {
		let picture = req.file;

		const resizedAndCovertedImg = await resizeImageAndWebpConvert(
			picture.buffer,
			200,
			200
		);

		await cloudinary.uploader
			.upload_stream(
				{
					resource_type: "image",
					folder: "Arya/profile",
				},
				async (err, result) => {
					if (err) {
						// An error occurred while uploading the image to Cloudinary.
						res.status(500).send({
							error: true,
							message:
								"Une erreur est survenue lors du téléchargement de l'image sur Cloudinary.",
						});
					}
					// Updating the picture of the user
					UserModel.findByIdAndUpdate(
						{ _id: req.params.id },
						{ $set: { picture: result.secure_url } },
						{ new: true }
					)
						.then((user) => {
							if (!user) {
								return res.status(404).send({
									error: true,
									message: "Cet utilisateur n'existe pas.", // This user does not exist
								});
							}

							res.status(200).send({
								error: false,
								message: "Photo de profil modifiée avec succès.", // Profil picture modified
								user: user,
							});
						})
						.catch((err) => res.status(500).send(err));
				}
			)
			.end(resizedAndCovertedImg);
	} catch (err) {
		return res.status(500).send({ error: true, message: err.message });
	}
};

// Update user
exports.updateUser = (req, res, next) => {
	UserModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				userName: "@" + req.body.userName,
				biographie: req.body.biographie,
			},
		},
		{
			setDefaultsOnInsert: true,
			new: true,
		}
	)
		.then((user) => {
			if (!user) {
				return res.status(404).send("Cet utilisateur n'existe pas"); // This user does not exist
			}
			res.status(200).send(user);
		})
		.catch((err) => res.status(500).send(err));
};

// Update Email
exports.sendEmailResetLink = async (req, res, next) => {
	const user = await UserModel.findById({ _id: req.params.id });
	const newEmail = req.body.newEmail;

	if (!user) {
		return res
			.status(404)
			.send({ error: true, message: "Aucun utilisateur trouvé" }); // No user has been found
	}

	if (user.email === newEmail) {
		return res.status(400).send({
			error: true,
			message: "L'adresse mail doit être différente de celle enregistré", // New Email need to be different from the previous one
		});
	}

	ResetEmailModel.findOne({ userEmail: newEmail })
		.then(async (data) => {
			if (data) {
				return res.status(400).send({
					error: true,
					message: "Un email a déjà été envoyé", // An email has already been sent
				});
			}

			const generateUniqueToken = crypto.randomBytes(32).toString("hex");
			const uniqueToken = generateUniqueToken;
			const url = `${process.env.CLIENT_URL}/verify/${user._id}/${uniqueToken}`;

			const sent = await sendEmail(
				newEmail,
				"Confirmation de changement d'adresse e-mail",
				resetEmailText(user, url)
			);

			if (!sent) {
				return res.status(400).send({
					error: false,
					message: "L'envoie de l'email a échoué", // Couldn't send the email
				});
			}
			new ResetEmailModel({
				userId: user._id,
				userEmail: newEmail,
				uniqueToken: uniqueToken,
			})
				.save()
				.then((emailModel) => {
					res.status(201).send({
						error: false,
						message:
							"Un lien de confirmation à été envoyé à votre nouvelle adresse mail", // A verification email has been sent
						emailModel: emailModel,
					});
				})
				.catch((err) => {
					res.status(500).send(err);
				});
		})
		.catch((err) => res.status(500).send(err));
};

// Update Password
exports.updateUserPassword = async (req, res, next) => {
	const user = await UserModel.findById({ _id: req.params.id });

	// Checks if the specified user exist
	if (!user) {
		return res
			.status(404)
			.send({ error: true, message: "Aucun utilisateur trouvé" });
	}

	// If the user wants to reset his password, he needs to enter his actual password
	const newPassword = req.body.newPassword;
	const confirmNewPassword = req.body.confirmNewPassword;

	bcrypt
		.compare(newPassword, user.password)
		.then((match) => {
			if (match) {
				return res.status(400).send({
					error: true,
					// newPassword cannot be the same as the old one
					message:
						"Le nouveau mot de passe ne peut pas être l'ancien mot de passe",
				});
			}

			if (!regex.password.test(newPassword)) {
				return res.status(400).send({
					error: true,
					message:
						"Votre mot de passe doit contenir 8 caractères, 1 chiffre, une majuscule, une minuscule et un symbol (!#@)",
				});
			}
			if (newPassword !== confirmNewPassword) {
				return res.status(506).send({
					error: true,
					message: "Les mots de passe ne correspondent pas", // Passwords does not match
				});
			}
			bcrypt
				.hash(newPassword, 10) // Then hash the new one and update it
				.then((hash) => {
					UserModel.findByIdAndUpdate(
						{ _id: req.params.id },
						{
							$set: {
								password: hash,
							},
						}
					)
						.then((user) => res.status(200).send(user))
						.catch((err) => res.status(500).send(err));
				});
		})
		.catch((err) => res.status(500).send(err));
};

// If the user forgot his password, then sending a reset code to his email
exports.sendPasswordResetCode = async (req, res, next) => {
	const userEmail = req.body.userEmail;

	const user = await UserModel.findOne({
		_id: req.params.id,
		email: userEmail,
	});

	if (!user) {
		return res
			.status(404)
			.send({ error: true, message: "Aucun utilisateur trouvé" }); // No user has been found
	}

	if (userEmail !== user.email) {
		return res.status(404).send({
			error: true,
			message:
				"L'adresse mail renseigné ne correspond pas à l'adresse mail enregistré",
		});
	}

	ResetPasswordModel.findOne({ userId: user._id, userEmail: user.email })
		.then(async (data) => {
			// If the reset code has been sent already
			if (data) {
				return res.status(400).send({
					error: true,
					message: "Un email a déjà été envoyé", // An email has already been sent
				});
			}
			const generateResetCode = crypto.randomBytes(3).toString("hex");
			const resetCode = generateResetCode;

			const sent = await sendEmail(
				user.email,
				"Rénitialisation du mot de passe",
				resetPasswordText(user, resetCode)
			);

			if (!sent) {
				return res.status(400).send({
					error: false,
					message: "L'envoie de l'email a échoué", // Couldn't send the email
				});
			}
			// If sent then create a reset password model
			new ResetPasswordModel({
				userId: user._id,
				userEmail: user.email,
				resetCode: resetCode,
			})
				.save()
				.then((passwordModel) => {
					res.status(201).send({
						error: false,
						message:
							"Le code de réinitialisation a été envoyé à l'email correspondante", // A verification email has been sent
						passwordModel: passwordModel,
					});
				})
				.catch((err) => {
					res.status(500).send(err);
				});
		})
		.catch((err) => res.status(500).send(err));
};

// Checks if the code has been verified, then authorize the user to update his password
exports.updateForgotPassword = async (req, res, next) => {
	// Getting the reset password ticket
	ResetPasswordModel.findOne({
		userId: req.params.id,
		userEmail: req.body.userEmail,
	})
		.then((data) => {
			const newPassword = req.body.newPassword;
			const confirmNewPassword = req.body.confirmNewPassword;

			if (!data) {
				return res.status(404).send({ message: "Votre code est expiré" }); // Reset code expired
			}

			if (!data.verified) {
				return res.status(400).send({ message: "Ce code n'a pas été vérifié" }); // Reset code not verified
			}

			if (!regex.password.test(newPassword)) {
				return res.status(400).send({
					error: true,
					// Password should contain at least 8 character, 1 number, 1 uppercase, 1 lowercase
					message:
						"Votre mot de passe doit contenir 8 caractères, 1 chiffre, une majuscule, une minuscule",
				});
			}

			if (newPassword !== confirmNewPassword) {
				return res.status(506).send({
					error: true,
					message: "Les mots de passe ne correspondent pas", // Passwords does not match
				});
			}

			bcrypt
				.hash(newPassword, 10) // Hash newPassword
				.then((hash) => {
					// Find the specified user by his email
					UserModel.findOne({ _id: req.params.id, email: data.userEmail })
						.then((user) => {
							if (!user) {
								return res
									.status(404)
									.send({ error: true, message: "Aucun utilisateur trouvé" });
							} else {
								// If user has been found
								bcrypt
									.compare(newPassword, user.password) // Compare newPassword with the one saved in the DB
									.then((match) => {
										if (match) {
											return res.status(400).send({
												error: true,
												// newPassword cannot be the same as the old one
												message:
													"Le nouveau mot de passe ne peut pas être l'ancien mot de passe",
											});
										}
										// If password is not matching with the old one, then update it
										UserModel.findOneAndUpdate(
											{ email: user.email },
											{
												$set: {
													password: hash, // saving the newPassword hashed
												},
											},
											{ new: true, setDefaultsOnInsert: true }
										)
											.then(() =>
												// If the password has been updated then delete the reset code
												ResetPasswordModel.findOneAndDelete({
													userEmail: user.email,
												})
													// Password successfully modified
													.then(() =>
														res.status(200).send({
															error: false,
															message: "Mot de passe modifié avec succès",
														})
													)
													.catch((err) => res.status(500).send(err))
											)
											.catch((err) => res.status(500).send(err));
									})
									.catch((err) => res.status(500).send(err));
							}
						})
						.catch((err) => res.status(500).send(err));
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

// Update Phone
exports.updateUserPhone = (req, res, next) => {
	UserModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				phone: req.body.phone,
			},
		},
		{
			setDefaultsOnInsert: true,
			new: true,
		}
	)
		.then((user) => {
			if (!user) {
				return res.status(404).send("Cet utilisateur n'existe pas");
			}
			res.status(200).send(user);
		})
		.catch((err) => res.status(500).send(err));
};
