const crypto = require("crypto");

function generateState() {
	const state = crypto.randomBytes(16).toString("hex");
	return state;
}

module.exports = generateState;
