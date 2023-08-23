const crypto = require("crypto");

function generateCodeChallenge(codeVerifier) {
	const codeChallenge = crypto
		.createHash("sha256")
		.update(codeVerifier)
		.digest("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");

	return codeChallenge;
}

module.exports = generateCodeChallenge;
