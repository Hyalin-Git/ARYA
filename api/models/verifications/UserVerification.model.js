const mongoose = require("mongoose");

const UserVerificationSchema = new mongoose.Schema(
	{
		userEmail: {
			type: String,
			unique: true,
			required: true,
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

module.exports = mongoose.model("UserVerification", UserVerificationSchema);
