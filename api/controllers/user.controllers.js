const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserVerification = require("../models/UserVerification.model");
const { sendEmail } = require("../middlewares/nodeMailer.middleware");
const { regex } = require("../utils/regex");
const ResetPasswordModel = require("../models/ResetPassword.model");

// Get all users
exports.getUsers = (req, res, next) => {
	UserModel.find()
		.then((users) => {
			if (!users) {
				return res.status(404).send("Aucun utilisateur n'a été trouvé");
			}
			res.status(200).send(users);
		})
		.catch((err) => res.status(500).send(err));
};

// Get one user
exports.getUser = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((user) => {
			if (!user) {
				return res.status(404).send("Cet utilisateur n'existe pas");
			}
			if (!user.verified) {
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
				return res
					.status(404)
					.send("Impossible de supprimer un utilisateur qui n'existe pas");
			}
			res.status(200).send(user);
		})
		.catch((err) => res.status(500).send(err));
};

exports.updateOneUser = (req, res, next) => {
	UserModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
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
				return res.status(404).send("Cet utilisateur n'existe pas");
			}
			res.status(200).send(user);
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
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	const newPassword = req.body.newPassword;
	const confirmNewPassword = req.body.confirmNewPassword;

	// Confirm password verification
	if (password !== confirmPassword) {
		return res.status(506).send({
			error: true,
			message: "Les mots de passe ne correspondent pas",
		});
	}

	bcrypt
		.compare(password, user.password) // If the given password his the same as the one saved in the DB
		.then((match) => {
			if (match) {
				if (!regex.password.test(newPassword)) {
					return res.status(400).send({
						error: true,
						message:
							"Votre mot de passe doit contenir 8 caractères, 1 chiffre, une majuscule, une minuscule",
					});
				}
				if (newPassword !== confirmNewPassword) {
					return res.status(506).send({
						error: true,
						message: "Les mots de passe ne correspondent pas",
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
					})
					.catch((err) => res.status(500).send(err));
			} else {
				res.status(506).send({
					error: true,
					message: "Le mot de passe saisi n'est pas votre mot de passe actuel",
				});
			}
		})
		.catch((err) => res.status(500).send(err));
};

// If the user forgot his password, then sending a reset code to his email
exports.sendResetCode = async (req, res, next) => {
	const userEmail = req.body.userEmail;
	const generateResetCode = crypto.randomBytes(3).toString("hex");
	const resetCode = generateResetCode;

	const user = await UserModel.findOne({ email: userEmail });

	if (!user) {
		return res
			.status(404)
			.send({ error: true, message: "Aucun utilisateur trouvé" }); // No user has been found
	}

	if (userEmail === user.email) {
		ResetPasswordModel.findOne({ userEmail: user.email })
			.then((data) => {
				// If the reset code has been sent already
				if (data) {
					return res.status(400).send({
						error: true,
						message: "Un email a déjà été envoyé", // An email has already been sent
					});
				}

				const mailText = `
					<div>
						<h2>Cher/Chère ${user.lastName}</h2>
						<p>Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte ${user.userName} associé à cette adresse e-mail.</p>
						<p>Si vous avez effectué cette demande, veuillez copier le code ci-dessous pour réinitialiser votre mot de passe : </p>

						<span style="font-size: 25px; font-weight: bold;">${resetCode}</span>
						
						<p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail. Votre compte reste sécurisé, et aucun changement n'a été apporté à votre mot de passe.</p>
						<br />
						Cordialement,
						L'équipe de Arya
					</div>
					`;
				sendEmail(user.email, "Rénitialisation du mot de passe", mailText)
					.then((sent) => {
						if (!sent) {
							return res.status(400).send({
								error: false,
								message: "L'envoie de l'email a échoué", // Couldn't send the email
							});
						}
						new ResetPasswordModel({
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
			})
			.catch((err) => res.status(500).send(err));
	} else {
		res.status(404).send({
			error: true,
			message:
				"L'adresse mail renseigné ne correspond à aucune adresse mail enregistré",
		});
	}
};
// Checks if the code has been verified, then authorize the user to update his
exports.updateForgotPassword = async (req, res, next) => {
	// Getting the reset password ticket
	ResetPasswordModel.findOne({ userEmail: req.body.userEmail })
		.then((data) => {
			const newPassword = req.body.newPassword;
			const confirmNewPassword = req.body.confirmNewPassword;

			if (!data) {
				return res.status(200).send({ message: "Votre code est expiré" }); // Reset code expired
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
					UserModel.findOne({ email: data.userEmail })
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
													.then(() => {
														res.status(200).send({
															error: false,
															message: "Mot de passe modifié avec succès", // Password successfully modified
														});
													})
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

// Update Email

// Update Phone
