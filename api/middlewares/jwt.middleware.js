const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserModel = require("../models/user.model");
const JwtKeyModel = require("../models/JwtKey.model");

let jwtSecretKey;

exports.randomSecret = async (req, res, next) => {
	JwtKeyModel.findOne()
		.then((jwt) => {
			if (!jwt) {
				jwtSecretKey = crypto.randomBytes(32).toString("hex");
				const jwt = new JwtKeyModel({
					secretKey: jwtSecretKey,
				});
				jwt
					.save()
					.then((jwt) => {
						jwtSecretKey = jwt.secretKey;
						next();
					})
					.catch((err) => res.status(500).send(err));
			} else {
				jwtSecretKey = jwt.secretKey;
				next();
			}
		})
		.catch((err) => res.status(500).send(err));
};

exports.authorization = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(
			token,
			`${process.env.JWT_SECRET_TOKEN}`,
			async (err, decoded) => {
				let user;
				if (err) {
					user = null;
					next();
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
			}
		);
	} else {
		res.sendStatus(401);
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
