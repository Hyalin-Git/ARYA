const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			unique: true,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		logo: {
			type: String,
			required: true,
		},
		activity: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
		},
		lookingForEmployes: { type: Boolean },
		websiteLink: { type: String },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Company", companySchema);
