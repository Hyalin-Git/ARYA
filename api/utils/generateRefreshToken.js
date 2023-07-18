const jwt = require("jsonwebtoken");

exports.generateRefreshToken = (user, rememberMe) => {
	console.log(rememberMe);
	return jwt.sign(
		{
			userId: user._id,
			isAdmin: user.admin,
		},
		`${process.env.REFRESH_TOKEN}`,
		{ expiresIn: rememberMe ? "30d" : "1d" }
	);
};
