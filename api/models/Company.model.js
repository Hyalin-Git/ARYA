const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		logo: {
			type: String,
		},
		activity: {
			type: String,
		},
		bio: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Company", companySchema);
