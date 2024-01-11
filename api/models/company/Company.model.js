const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
	{
		leaderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			unique: true,
			required: true,
		},
		members: {
			type: [
				{
					memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
					role: {
						type: String,
						enum: ["recruiter", "worker"],
						default: "worker",
					},
				},
				{
					timestamps: true,
				},
			],
		},
		name: {
			type: String,
			required: "Le nom de la compagnie doit être fournit",
		},
		picture: {
			type: String,
			required: "La photo de la compagnie doit être fournit",
		},
		activity: {
			type: String,
			required: "L'activité de la compagnie doit être fournit",
		},
		bio: {
			type: String,
		},
		lookingForEmployees: { type: Boolean },
		links: { type: [String] },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Company", companySchema);
