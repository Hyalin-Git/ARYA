const crypto = require("crypto");

function generateCodeVerifier() {
	const codeVerifier = crypto.randomBytes(32).toString("hex");
	return codeVerifier;
}

module.exports = generateCodeVerifier;
