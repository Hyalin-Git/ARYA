const mongoose = require("mongoose");

const AnswerSchema = mongoose.Schema(
	{
		commentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			required: true,
		},
		answerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Answer",
		},
		answererId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		media: {
			type: [String],
		},
		reactions: {
			like: { type: [String] },
			awesome: { type: [String] },
			love: { type: [String] },
			funny: { type: [String] },
		},
		answersLength: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Answer", AnswerSchema);
