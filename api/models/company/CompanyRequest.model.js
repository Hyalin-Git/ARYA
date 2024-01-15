const mongoose = require("mongoose");

// checks email validity
const validateEmail = function (email) {
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	regex.test(email);
};

const compagnyRequestSchema = mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		toCompanyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true,
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			required: "Une adresse mail est requise",
			validate: [validateEmail, "Veuillez entrer une adresse mail valide"],
		},
		content: {
			type: String,
			required: "Veuillez remplir ce formulaire",
		},
		skills: {
			type: [String],
			required: true,
		},
		cv: { type: Buffer },
		portfolio: { type: String },
		status: {
			type: String,
			enum: ["accepted", "rejected", "progress", "pending"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("CompanyRequest", compagnyRequestSchema);
