const mongoose = require("mongoose");

const date = new Date();
const JwtSchema = new mongoose.Schema(
	{
		secretKey: { type: String, required: true },
		expiresIn: {
			type: Date,
			default: date.setTime(date.getTime() + 60000),
		},
	},

	{
		timestamps: true,
	}
);

JwtSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model("Jwt", JwtSchema);
