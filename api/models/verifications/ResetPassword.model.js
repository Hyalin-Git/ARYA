const mongoose = require("mongoose");

const ResetPasswordSchema = new mongoose.Schema(
	{
		userEmail: {
			type: String,
			unique: true,
			required: true,
		},
		resetCode: { type: String, required: true },
		verified: { type: Boolean, default: false },
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

module.exports = mongoose.model("ResetPassword", ResetPasswordSchema);
