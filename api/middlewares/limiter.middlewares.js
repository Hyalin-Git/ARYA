const { RateLimiter } = require("limiter");

exports.passwordResetLimiter = new RateLimiter({
	tokensPerInterval: 2,
	interval: "minute",
	fireImmediately: true,
});
