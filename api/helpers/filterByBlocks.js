exports.filterUsers = (users, authUser) => {
	const filteredUsers = users.filter((user) => {
		const isBlockedByAuthUser = authUser.blockedUsers.includes(user._id);

		const isBlockedByUser = user.blockedUsers.includes(authUser._id);

		return !isBlockedByAuthUser && !isBlockedByUser;
	});

	return filteredUsers;
};

exports.filterPosts = (posts, authUser) => {
	const filteredPosts = posts.filter((post) => {
		const isBlockedByAuthUser = authUser.blockedUsers.includes(
			post.posterId._id
		);

		const isBlockedByPoster = post.posterId.blockedUsers.includes(authUser._id);

		return !isBlockedByAuthUser && !isBlockedByPoster;
	});

	const response = filteredPosts.map((filteredPost) => {
		const postsWithoutBlockedUsers = { ...filteredPost.toObject() };

		delete postsWithoutBlockedUsers.posterId.blockedUsers;

		return postsWithoutBlockedUsers;
	});

	return response;
};

exports.filterReposts = (reposts, authUser) => {
	const filteredReposts = reposts.filter((repost) => {
		const isBlockedByAuthUser = authUser.blockedUsers.includes(
			repost.reposterId._id
		);

		const isBlockedByPoster = repost.reposterId.blockedUsers.includes(
			authUser._id
		);

		return !isBlockedByAuthUser && !isBlockedByPoster;
	});

	const response = filteredReposts.map((filteredRepost) => {
		if (
			authUser.blockedUsers.includes(filteredRepost.postId?.posterId._id) ||
			filteredRepost.postId?.posterId.blockedUsers.includes(authUser._id)
		) {
			filteredRepost.postId.text = null;
			filteredRepost.postId.media = null;
		}

		if (filteredRepost.postId !== null) {
			filteredRepost.postId.posterId.blockedUsers = undefined;
		}
		filteredRepost.reposterId.blockedUsers = undefined;

		return filteredRepost;
	});

	return response;
};

exports.filterComments = (comments, authUser) => {
	const filteredComments = comments.filter((comment) => {
		const isBlockedByAuthUser = authUser.blockedUsers.includes(
			comment.commenterId._id
		);

		const isBlockedByPoster = comment.commenterId.blockedUsers.includes(
			authUser._id
		);

		return !isBlockedByAuthUser && !isBlockedByPoster;
	});

	const response = filteredComments.map((filteredComment) => {
		const commentsWithoutBlockedUsers = { ...filteredComment.toObject() };

		delete commentsWithoutBlockedUsers.commenterId.blockedUsers;

		return commentsWithoutBlockedUsers;
	});

	return response;
};

exports.filterAnswers = (answers, authUser) => {
	const filteredAnswers = answers.filter((answer) => {
		const isBlockedByAuthUser = authUser.blockedUsers.includes(
			answer.answererId._id
		);

		const isBlockedByPoster = answer.answererId.blockedUsers.includes(
			authUser._id
		);

		return !isBlockedByAuthUser && !isBlockedByPoster;
	});

	const response = filteredAnswers.map((filteredAnswer) => {
		const answersWithoutBlockedUsers = { ...filteredAnswer.toObject() };

		delete answersWithoutBlockedUsers.answererId.blockedUsers;

		return answersWithoutBlockedUsers;
	});

	return response;
};
