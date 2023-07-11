const UserModel = require("../models/user.model");

exports.getUser = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(500).send(err));
};
