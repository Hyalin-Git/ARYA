const mongoose = require("mongoose");

const JwtSchema = new mongoose.Schema(
	{
		secretKey: { type: String, required: true },
		status: { type: String, required: true },
		expiresAt: {
			type: Date,
		},
	},

	{
		timestamps: true,
	}
);

// JwtSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model("Jwt", JwtSchema);
