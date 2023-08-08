const mongoose = require("mongoose");

const SocialMediaTokenSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			unique: true,
			required: true,
			ref: "User",
		},
		twitter: {
			accessToken: { type: String, required: true },
			expireTime: {
				type: Date,
				required: true,
			},
			refreshToken: {
				type: String,
				required: true,
			},
		},
		tiktok: {
			accessToken: { type: String },
			refreshToken: {
				type: String,
			},
		},
	},

	{
		timestamps: true,
	}
);

module.exports = mongoose.model("SocialMediaToken", SocialMediaTokenSchema);
