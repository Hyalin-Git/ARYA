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
			twitterId: { type: String, required: true },
			twitterProfilPic: { type: String },
			twitterName: { type: String, required: true },
			twitterUsername: { type: String, required: true },
			accessToken: { type: String, required: true },
			accessTokenExpireAt: {
				type: Date,
				required: true,
			},
			refreshToken: {
				type: String,
				required: true,
			},
		},
		// tiktok: {
		// 	tiktokId: { type: String, required: true },
		// 	tiktokName: { type: String, required: true },
		// 	tiktokAvatar: { type: String, required: true },
		// 	accessToken: { type: String },
		// 	refreshToken: {
		// 		type: String,
		// 	},
		// },
	},

	{
		timestamps: true,
	}
);

module.exports = mongoose.model("SocialMediaToken", SocialMediaTokenSchema);
