const jwt = require("jsonwebtoken");
const UserModel = require("../models/users/User.model");
const PostModel = require("../models/posts/Post.model");

exports.authenticate = (req, res, next) => {
	const token = req.headers?.authorization?.split(" ")[1];
	if (!token) {
		return res
			.status(403)
			.send({ error: true, message: "Accès refusé: aucun token reçu" });
	} else {
		jwt.verify(token, `${process.env.ACCESS_TOKEN}`, async (err, decoded) => {
			if (err) {
				res.locals.user = null;
				res.status(403).send({
					error: true,
					message: "Accès refusé: ce token n'est plus valide",
				});
			} else {
				if (decoded) {
					let user = await UserModel.findById(decoded.userId);
					res.locals.user = user;

					console.log(user);
					console.log(decoded);
					console.log(
						"---------- " + user.email + " est connecté" + "----------"
					);
					next();
				}
			}
		});
	}
};

exports.authorize = (req, res, next) => {
	let user = res.locals.user;
	const targetUser = req.query.userId || req.params.id;

	if (targetUser === user._id.toString()) {
		next();
	} else {
		return res.status(403).send({
			error: true,
			message: "Access denied",
		});
	}
};

exports.isAdmin = (req, res, next) => {
	let user = res.locals.user;
	if (user.admin === true) {
		next();
	} else {
		res.sendStatus(401);
	}
};
