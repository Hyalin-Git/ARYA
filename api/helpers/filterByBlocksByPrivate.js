// Those functions are checking if the auth user is blocked and vice versa
// They are also checking if the user who posted something is in private account
// Then they return the response depending on these conditions

exports.filterUsers = (users, authUser) => {
	const filteredUsers = users.filter((user) => {
		const isBlockedByAuthUser = authUser.blockedUsers.includes(user._id);

		const isBlockedByUser = user.blockedUsers.includes(authUser._id);

		return !isBlockedByAuthUser && !isBlockedByUser;
	});

	return filteredUsers;
};

exports.filterAllElements = (elements, path, authUser) => {
	const filteredPosts = elements.filter((elt) => {
		// Logic for blocked user
		const isBlockedByAuthUser = authUser.blockedUsers.includes(elt[path]._id);

		const isBlockedByPoster = elt[path].blockedUsers.includes(authUser._id);

		// Logic for private account
		const userIsPrivate = elt[path].isPrivate === true;

		const authUserIsFollowingUser = authUser.following.includes(elt[path]._id);

		const userIsFollowedByAuthUser = elt[path].followers.includes(authUser._id);

		return (
			!isBlockedByAuthUser &&
			!isBlockedByPoster &&
			(!userIsPrivate || (authUserIsFollowingUser && userIsFollowedByAuthUser))
		);
	});

	const response = filteredPosts.map((filteredPost) => {
		filteredPost[path].blockedUsers = undefined;
		filteredPost[path].followers = undefined;

		return filteredPost;
	});

	return response;
};

exports.filterOneElement = (post, path, authUser) => {
	const reason = { error: true };
	const isBlockedByAuthUser = authUser.blockedUsers.includes(post[path]._id);
	const isBlockedByPoster = post[path].blockedUsers.includes(authUser._id);

	if (isBlockedByAuthUser) {
		reason.isBlockedByAuthUser = true;
		return reason;
	}
	if (isBlockedByPoster) {
		reason.isBlockedByPosterssage = true;
		return reason;
	}

	post[path].blockedUsers = undefined;
	post[path].followers = undefined;

	return post;
};

exports.filterReposts = (reposts, authUser) => {
	const filteredReposts = reposts.filter((repost) => {
		// Logic for blocked user
		const isBlockedByAuthUser = authUser.blockedUsers.includes(
			repost.reposterId._id
		);

		const isBlockedByPoster = repost.reposterId.blockedUsers.includes(
			authUser._id
		);

		// Logic for private account
		const userIsPrivate = repost.reposterId.isPrivate === true;

		const authUserIsFollowingUser = authUser.following.includes(
			repost.reposterId._id
		);
		const userIsFollowedByAuthUser = repost.reposterId.followers.includes(
			authUser._id
		);

		return (
			!isBlockedByAuthUser &&
			!isBlockedByPoster &&
			(!userIsPrivate || (authUserIsFollowingUser && userIsFollowedByAuthUser))
		);
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
		filteredRepost.reposterId.followers = undefined;

		return filteredRepost;
	});

	return response;
};

exports.filterComments = (comments, authUser) => {
	const filteredComments = comments.filter((comment) => {
		// Logic for blocked user
		const isBlockedByAuthUser = authUser.blockedUsers.includes(
			comment.commenterId._id
		);

		const isBlockedByPoster = comment.commenterId.blockedUsers.includes(
			authUser._id
		);

		// Logic for private account
		const userIsPrivate = comment.commenterId.isPrivate === true;

		const authUserIsFollowingUser = authUser.following.includes(
			comment.commenterId._id
		);

		const userIsFollowedByAuthUser = comment.commenterId.followers.includes(
			authUser._id
		);

		return (
			!isBlockedByAuthUser &&
			!isBlockedByPoster &&
			(!userIsPrivate || (authUserIsFollowingUser && userIsFollowedByAuthUser))
		);
	});

	const response = filteredComments.map((filteredComment) => {
		filteredComment.commenterId.blockedUsers = undefined;
		filteredComment.commenterId.followers = undefined;

		return filteredComment;
	});

	return response;
};

exports.filterAnswers = (answers, authUser) => {
	const filteredAnswers = answers.filter((answer) => {
		// Logic for blocked user
		const isBlockedByAuthUser = authUser.blockedUsers.includes(
			answer.answererId._id
		);

		const isBlockedByPoster = answer.answererId.blockedUsers.includes(
			authUser._id
		);

		// Logic for private account
		const userIsPrivate = answer.answererId.isPrivate === true;

		const authUserIsFollowingUser = authUser.following.includes(
			answer.answererId._id
		);

		const userIsFollowedByAuthUser = answer.answererId.followers.includes(
			authUser._id
		);

		return (
			!isBlockedByAuthUser &&
			!isBlockedByPoster &&
			(!userIsPrivate || (authUserIsFollowingUser && userIsFollowedByAuthUser))
		);
	});

	const response = filteredAnswers.map((filteredAnswer) => {
		filteredAnswer.answererId.blockedUsers = undefined;
		filteredAnswer.answererId.followers = undefined;

		return filteredAnswer;
	});

	return response;
};
