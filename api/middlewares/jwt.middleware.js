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
	JwtKeyModel.findOne()
		.then((jwtKey) => {
			if (!jwtKey) {
				res.status(401).send({
					message: "Votre session à expiré identifier vous à nouveau",
				});
			} else {
				if (token) {
					jwt.verify(token, `${jwtKey.secretKey}`, async (err, decoded) => {
						let user;
						if (err) {
							user = null;
							res.sendStatus(401);
						} else {
							if (decoded) {
								user = await UserModel.findById({ _id: decoded.userId });
								res.locals.user = user;
								console.log(
									"---------------- " +
										user.email +
										" is connected" +
										" ----------------"
								);

								next();
							}
						}
					});
				} else {
					res.sendStatus(401);
				}
			}
		})
		.catch((err) => res.status(500).send(err));
};

exports.isAdmin = (req, res, next) => {
	let user = res.locals.user;
	if (user.isAdmin === true) {
		next();
	} else {
		res.sendStatus(401);
	}
};
