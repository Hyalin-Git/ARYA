const { RateLimiter } = require("limiter");

exports.passwordResetLimiter = new RateLimiter({
	tokensPerInterval: 1,
	interval: 30000, // Interval de 30 secondes
	fireImmediately: true,
});
