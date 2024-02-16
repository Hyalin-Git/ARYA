const jwt = require("jsonwebtoken");
const UserModel = require("../models/users/User.model");

exports.authenticate = (req, res, next) => {
	const token = req.headers?.authorization?.split(" ")[1];
	if (!token) {
		const getId = req.url.split("/")[1];
		const postUrl = "/api/posts";
		const repostUrl = "/api/reposts";
		if (req.baseUrl === postUrl || req.baseUrl === repostUrl) {
			if (!getId) {
				return res
					.status(403)
					.send({ error: true, message: "Accès refusé: aucun token reçu" });
			}
			return next();
		}
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
					console.log(decoded);
					const user = await UserModel.findById(decoded.userId);

					if (!user) {
						return res.status(404).send({
							error: true,
							message: "Impossible de se connecter à un compte inexistant",
						});
					}

					res.locals.user = user;
					res.locals.decodedToken = decoded;
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

exports.authorize = async (req, res, next) => {
	try {
		const authUser = res.locals.user;
		const userId = req.query.userId || req.params.id;

		const user = await UserModel.findById({ _id: userId });

		if (!user) {
			return res.status(404).send({
				error: true,
				message: `L'utilisateur avec ID : ${userId} n'existe pas`,
			});
		}

		if (userId === authUser._id.toString() || user.admin) {
			next();
		} else {
			return res.status(403).send({
				error: true,
				message: "Access denied",
			});
		}
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
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
