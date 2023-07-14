const UserModel = require("../models/user.model");

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
