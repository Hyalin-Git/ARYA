const UserModel = require("../models/users/User.model");

exports.checkRole = async (req, res, next) => {
	const { companyId } = req.query;
	const authUser = res.locals.user;

	if (companyId) {
		if (!authUser.company) {
			return res.status(403).send({ error: true, message: "" });
		}
        
	}
};
