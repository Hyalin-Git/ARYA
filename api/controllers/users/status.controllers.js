const StatusModel = require("../../models/users/Status.model");

exports.getStatus = (req, res, next) => {
	StatusModel.find()
		.then((status) => res.status(200).send(status))
		.catch((err) => res.status(500).send(err));
};
