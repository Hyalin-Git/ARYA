const mongoose = require("mongoose");

const ReportPostSchema = mongoose.Schema(
	{
		reporterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		reportedPostId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		reason: {
			type: String,
			required: true,
			enum: {
				values: [
					"Discours haineux ou discriminatoire",
					"Contenu inapproprié",
					"Comportement de harcèlement",
					"Faux compte ou usurpation d'identité",
					"Spam ou contenu indésirable",
					"Incitation à la violence ou aux activités illégales",
					"Autre",
				],
				message: "{VALUE} n'est pas une raison valable !",
			},
		},
		message: {
			type: String,
			maxLength: 500,
		},
		status: {
			type: String,
			default: "En attente",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("ReportPost", ReportPostSchema);
