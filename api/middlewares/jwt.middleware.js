const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserModel = require("../models/user.model");
const JwtKeyModel = require("../models/JwtKey.model");
const jwtSecretKey = require("../controllers/auth.controllers");

// JwtKeyModel.findOne()
// 	.then((jwt) => {
// 		if (!jwt) {
// 			jwtSecretKey = crypto.randomBytes(32).toString("hex");
// 			const jwt = new JwtKeyModel({
// 				secretKey: jwtSecretKey,
// 			});
// 			jwt
// 				.save()
// 				.then((jwt) => {
// 					jwtSecretKey = jwt.secretKey;
// 					next();
// 				})
// 				.catch((err) => res.status(500).send(err));
// 		} else {
// 			jwtSecretKey = jwt.secretKey;
// 		}
// 	})
// 	.catch((err) => res.status(500).send(err));

exports.authorization = (req, res, next) => {
	const token = req.cookies.jwt;
	if (!token) {
		return res
			.status(403)
			.send({ error: true, message: "Accès refusé: aucun token reçu" });
	} else {
		jwt.verify(token, `${process.env.ACCESS_TOKEN}`, async (err, decoded) => {
			if (err) {
				res.locals.user = null;
				res.sendStatus(403);
			} else {
				if (decoded) {
					let user = await UserModel.findById(decoded.userId);
					res.locals.user = user;
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
