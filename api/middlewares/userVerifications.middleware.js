const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");

// Checks the validity of the given password with the one saved in the DB
exports.checkUserPassword = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((user) => {
			if (!user) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun utilisateur trouvé" });
			}

			const password = req.body.password;

			if (!password) {
				return res.status(400).send({
					error: true,
					message: "Aucun mot de passe reçu",
				});
			}

			bcrypt
				.compare(password, user.password)
				.then((match) => {
					if (!match) {
						return res.status(506).send({
							error: true,
							message:
								"Le mot de passe saisi n'est pas votre mot de passe actuel",
						});
					}
					next();
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

// Checks if the user has a verified account
exports.checkIfUserVerified = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((user) => {
			if (!user) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun utilisateur trouvé" });
			}

			if (!user.verified) {
				return res.status(403).send({
					error: true,
					message: "Accès refusé: Ce compte n'est pas vérifié",
				});
			}
		})
		.catch((err) => res.status(500).send(err));
};
