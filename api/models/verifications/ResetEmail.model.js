const mongoose = require("mongoose");

const ResetEmailSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			unique: true,
			required: true,
			ref: "User",
		},
		userEmail: {
			type: String,
			unique: true,
			required: true,
		},
		uniqueToken: { type: String, required: true },
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

module.exports = mongoose.model("ResetEmail", ResetEmailSchema);
