const UserModel = require("../../models/users/User.model");
const CompanyModel = require("../../models/company/Company.model");
const FreelanceModel = require("../../models/users/Freelance.model");
const PostModel = require("../../models/posts/Post.model");
const RepostModel = require("../../models/posts/Repost.model");
const CommentModel = require("../../models/posts/Comment.model");
const TaskModel = require("../../models/users/Task.model");
const ResetPasswordModel = require("../../models/verifications/ResetPassword.model");
const ResetEmailModel = require("../../models/verifications/ResetEmail.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendEmail } = require("../../utils/mail/nodeMailer");
const { regex } = require("../../utils/RegexPatterns/regex");
const {
	resetPasswordText,
	resetEmailText,
} = require("../../utils/mail/mailText");
const { uploadFile, destroyFile } = require("../../helpers/cloudinaryManager");
const { filterUsers } = require("../../helpers/filterResponse");
const FollowRequestModel = require("../../models/users/FollowRequest.model");
const {
	passwordResetLimiter,
} = require("../../middlewares/limiter.middlewares");

// Get all users
exports.getUsers = (req, res, next) => {
	const authUser = res.locals.user;
	const { userName, lookingForJob } = req.query;

	function filter() {
		const filter = {};

		if (userName) {
			filter.userName = { $regex: userName, $options: "i" };
		}

		if (lookingForJob) {
			filter.lookingForJob = lookingForJob;
		}

		return filter;
	}
	UserModel.find(filter())
		.select("-password")
		.then(async (users) => {
			const filteredUsers = await filterUsers(users, authUser);

			if (filteredUsers.length <= 0) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun utilisateur n'a été trouvé" }); // No users found
			}

			res.status(200).send(filteredUsers);
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

// Update user profil picture
exports.updateUserPicture = async (req, res, next) => {
	const picture = req.file;

	UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			if (!user) {
				return res.status(404).send({
					error: true,
					message: "Cet utilisateur n'existe pas.", // This user does not exist
				});
			}
			if (user.picture) {
				await destroyFile(user, "profile");
			}
			const uploadResponse = await uploadFile(picture, "profile");
			const updatePicture = await UserModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: { picture: uploadResponse },
				},
				{
					new: true,
					setDefaultsOnInsert: true,
				}
			);

			return res.status(200).send({
				error: false,
				message: "Photo de profil modifiée avec succès.", // Profil picture modified
				user: updatePicture.picture,
			});
		})
		.catch((err) => res.status(500).send(err.message ? err.message : err));
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
		email: userEmail,
	});

	if (!user) {
		return res
			.status(404)
			.send({ error: true, message: "Aucun utilisateur trouvé" }); // No user has been found
	}

	const remainingRequests = await passwordResetLimiter.removeTokens(1);

	if (remainingRequests < 0) {
		return res.status(429).send({ error: true, message: "Too many requests" });
	}
	ResetPasswordModel.findOne({ userEmail: user.email })
		.then(async (data) => {
			// If the reset code has been sent already
			if (data) {
				await ResetPasswordModel.findByIdAndDelete({ _id: data._id });
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
		resetCode: req.body.resetCode,
	})
		.then((data) => {
			const newPassword = req.body.newPassword;

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

// Delete one user
exports.deleteOneUser = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			if (!user) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer un utilisateur qui n'existe pas",
				}); // Impossible to delete a non-existent user
			}
			if (user.picture) {
				await destroyFile(user, "profile"); // Delete all files from Cloudinary
			}
			await UserModel.findByIdAndDelete({ _id: req.params.id }); // Then delete the comment
			// Delete every document of the deleted user
			await PostModel.deleteMany({ posterId: req.params.id });
			await RepostModel.deleteMany({ reposterId: req.params.id });
			await TaskModel.deleteMany({ userId: req.params.id });
			await CommentModel.deleteMany({ commenterId: req.params.id });
			await CompanyModel.deleteMany({ userId: req.params.id });
			await FreelanceModel.deleteMany({ userId: req.params.id });

			return res.status(200).send(user);
		})
		.catch((err) => res.status(500).send(err.message ? err.message : err));
};

exports.blockAnUser = async (req, res, next) => {
	try {
		const targetUser = await UserModel.findById({ _id: req.body.idToBlock });

		if (targetUser.admin === true) {
			return res.status(403).send({
				error: true,
				message: "Vous ne pouvez pas bloquer cet utilisateur",
			});
		}

		const user = await UserModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$addToSet: {
					blockedUsers: targetUser._id,
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		if (!user) {
			return res
				.status(404)
				.send({ error: true, message: "Utilisateur non trouvé" });
		}

		// Removes the blocked user from the followers/ing of the user who blocked
		await UserModel.findByIdAndUpdate(
			{ _id: user._id },
			{
				$pull: {
					followers: targetUser._id,
					following: targetUser._id,
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);
		// Removes the user from the followers/ing from the blocked user
		await UserModel.findByIdAndUpdate(
			{ _id: req.body.idToBlock },
			{
				$pull: {
					followers: user._id,
					following: user._id,
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		return res.status(200).send(user);
	} catch (err) {
		return res
			.status(500)
			.send({ error: true, message: err.message || "Erreur du serveur" });
	}
};

exports.unblockAnUser = (req, res, next) => {
	UserModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$pull: {
				blockedUsers: req.body.idToBlock,
			},
		},
		{
			new: true,
			setDefaultsOnInsert: true,
		}
	)
		.then((blockedUser) => res.status(200).send(blockedUser))
		.catch((err) => res.status(500).send(err));
};

// Follow Controllers

exports.getFollow = (req, res, next) => {
	UserModel.findById({ _id: req.params.id }, { following: 1 })
		.populate("following", "lastName firstName userName")
		.exec()
		.then((following) => res.status(200).send(following))
		.catch((err) => res.status(500).send(err));
};

exports.getFollowers = (req, res, next) => {
	UserModel.findById({ _id: req.params.id }, { followers: 1 })
		.populate("followers", "lastName firstName userName")
		.exec()
		.then((followers) => res.status(200).send(followers))
		.catch((err) => res.status(500).send(err));
};

exports.follow = async (req, res, next) => {
	try {
		const { userId, idToFollow } = req.query;

		if (!userId || !idToFollow) {
			return res
				.status(400)
				.send({ error: true, message: "Paramètres manquant" });
		}

		const userToFollow = await UserModel.findById({ _id: idToFollow });

		// If the user to follow is in private mode then send a
		if (userToFollow.isPrivate === true) {
			const getFollowRequest = await FollowRequestModel.findOne({
				fromUserId: userId,
				toUserId: idToFollow,
			});

			if (!getFollowRequest) {
				const followRequest = new FollowRequestModel({
					fromUserId: userId,
					toUserId: idToFollow,
				});

				const savedFollowRequest = await followRequest.save();

				return res.status(201).send(savedFollowRequest);
			}

			const deletedFollowRequest = await FollowRequestModel.findOneAndDelete({
				fromUserId: userId,
				toUserId: idToFollow,
			});

			return res.status(200).send(deletedFollowRequest);
		}

		const userFollowing = await UserModel.findByIdAndUpdate(
			{ _id: userId },
			{
				$addToSet: {
					following: idToFollow,
				},
			},
			{ setDefaultsOnInsert: true, new: true }
		);

		const userFollowed = await UserModel.findByIdAndUpdate(
			{ _id: idToFollow },
			{
				$addToSet: {
					followers: userId,
				},
			},
			{ setDefaultsOnInsert: true, new: true }
		);

		return res.status(200).send({
			userFollowing: userFollowing.following,
			userFollowed: userFollowed.followers,
		});
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.unfollow = (req, res, next) => {
	const { userId, idToUnfollow } = req.query;

	UserModel.findByIdAndUpdate(
		{ _id: userId },
		{
			$pull: {
				following: idToUnfollow,
			},
		},
		{ setDefaultsOnInsert: true, new: true }
	)
		// .then(() => res.status(200).send())
		.catch((err) => res.status(500).send(err));

	UserModel.findByIdAndUpdate(
		{ _id: idToUnfollow },
		{
			$pull: {
				followers: userId,
			},
		},
		{ setDefaultsOnInsert: true, new: true }
	)
		.then((unfollowUpdate) => res.status(200).send(unfollowUpdate))
		.catch((err) => res.status(500).send(err));
};
