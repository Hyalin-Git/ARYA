exports.errorsHandler = (err) => {
	let errorMsg;
	console.log(err.message.includes("401"));
	if (err.message.includes("403")) {
		errorMsg =
			"Unsupported Authentification, Supported authentication types are [OAuth 1.0a User Context, OAuth 2.0 User Context].";
		return errorMsg;
	}
	if (err.message.includes("401")) {
		errorMsg =
			"Unauthorized, the given access_token has expired or may be wrong";
		return errorMsg;
	}
	if (err.message.includes("400")) {
		errorMsg = "One or more parameters to your request was invalid.";
		return errorMsg;
	}
};

exports.statusCodeHandler = (err) => {
	let statusCode;
	if (err.message.includes("403")) {
		statusCode = 403;
		return statusCode;
	}
	if (err.message.includes("401")) {
		statusCode = 401;
		return statusCode;
	}
	if (err.message.includes("400")) {
		statusCode = 400;
		return statusCode;
	}
};
