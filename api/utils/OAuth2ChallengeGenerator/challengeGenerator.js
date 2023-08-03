const crypto = require("crypto");
exports.generateCodeVerifier = () => {
	const codeVerifier = crypto.randomBytes(32).toString("hex");
	return codeVerifier;
};

exports.generateCodeChallenge = (codeVerifier) => {
	const codeChallenge = crypto
		.createHash("sha256")
		.update(codeVerifier)
		.digest("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");

	return codeChallenge;
};
