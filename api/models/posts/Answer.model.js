const mongoose = require("mongoose");

const AnswerSchema = mongoose.Schema(
	{
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		repostId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Repost",
		},
		commentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			required: true,
		},
		parentAnswerId: {
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
			love: { type: [String] },
			funny: { type: [String] },
			surprised: { type: [String] },
			sad: { type: [String] },
		},
		repostsLength: {
			type: Number,
			default: 0,
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
