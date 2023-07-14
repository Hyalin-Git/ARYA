const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

exports.authorization = (req, res, next) => {
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

exports.isAdmin = (req, res, next) => {
	let user = res.locals.user;
	if (user.isAdmin === true) {
		next();
	} else {
		res.sendStatus(401);
	}
};
