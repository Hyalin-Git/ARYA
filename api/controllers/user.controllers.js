const UserModel = require("../models/user.model");
const crypto = require("crypto");
const UserVerification = require("../models/UserVerification.model");
const { sendEmail } = require("../middlewares/nodeMailer.middleware");

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
	UserModel.findById({ _id: req.params.id })
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
	UserModel.findById(
		{ _id: req.params.id },
		{
			$set: {
				phone: req.body.phone,
			},
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

// Send a new email if the user isn't verified
exports.checkUserVerification = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((user) => {
			if (!user) {
				return res.status(404).send("Cet utilisateur n'existe pas"); // This user does not exist
			}
			// If the corresponding user isn't verified send an email
			if (!user.verified) {
				const token = new UserVerification({
					userId: user._id,
					uniqueToken: crypto.randomBytes(32).toString("hex"),
				});
				token
					.save()
					.then((token) => {
						const url = `${process.env.CLIENT_URL}/users/${user._id}/verify/${token.uniqueToken}`;

						sendEmail(user.email, "Verify Email", url);
						res.status(201).send({
							error: false,
							message: "Un email de vérification a été envoyé !", // A verification email has been sent
						});
					})
					.catch((err) => {
						// If the user already has a valid token
						// err.code 11000 = duplicate entry
						if (err.code === 11000) {
							res.status(500).send({
								error: true,
								message: "Un email a déjà été envoyé", // An email has already been sent
								err: err,
							});
						}
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
