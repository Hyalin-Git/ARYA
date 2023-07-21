const mongoose = require("mongoose");

const UserVerificationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			unique: true,
			required: true,
			ref: "User",
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
