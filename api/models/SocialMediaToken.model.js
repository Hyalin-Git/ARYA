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
			twitterId: { type: String },
			twitterProfilPic: { type: String },
			twitterName: { type: String },
			twitterUsername: { type: String },
			accessToken: { type: String },
			accessTokenExpireAt: {
				type: Date,
			},
			refreshToken: {
				type: String,
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
		facebook: {
			facebookId: { type: String },
			facebookProfilPic: { type: String },
			facebookName: { type: String },
			accessToken: { type: String },
			accessTokenExpireAt: { type: Date },
		},
	},

	{
		timestamps: true,
	}
);

module.exports = mongoose.model("SocialMediaToken", SocialMediaTokenSchema);
