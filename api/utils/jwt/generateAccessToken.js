const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
	return jwt.sign(
		{
			userId: user._id,
			isAdmin: user.admin,
		},
		`${process.env.ACCESS_TOKEN}`,
		{ expiresIn: "15m" }
	);
};
