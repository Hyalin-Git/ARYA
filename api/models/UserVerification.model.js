const mongoose = require("mongoose");

const UserVerification = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
			unique: true,
		},
		uniqueToken: { type: String, required: true },
		createdAt: {
			type: Date,
			default: Date.now(),
			expires: 3600,
		},
	},

	{
		timestamps: true,
	}
);

// JwtSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model("UserVerification", UserVerification);
