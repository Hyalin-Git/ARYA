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

exports.filterElements = (elements, path, authUser) => {
	const filteredElts = elements.filter((elt) => {
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

	return generateResponse(filteredElts, path, authUser);
};

function generateResponse(filteredElts, path, authUser) {
	// Map through every filtered elements
	const response = filteredElts.map((elt) => {
		// There is a condition with reposterId because,
		// if you didn't block or anything the reposterId the repost will appears in the feed
		// but what if you blocked the user of the reposted post ?
		// which means that we need to check the reposted post
		if (path === "reposterId") {
			const isBlockedByAuthUser = authUser.blockedUsers.includes(
				elt.postId?.posterId._id
			);
			const isBlockedByPoster = elt.postId?.posterId.blockedUsers.includes(
				authUser._id
			);

			const isPrivate = elt.postId?.posterId.isPrivate === true;
			const isAuthUserFollowingPoster = authUser.following.includes(
				elt.postId?.posterId._id
			);
			const isAuthUserInPosterFollowers =
				elt.postId?.posterId.followers.includes(authUser._id);

			function shouldHideContent() {
				// If auth user blocked the posterId and vice versa then return true
				if (isBlockedByAuthUser || isBlockedByPoster) {
					// Removing isPrivate for the frontend to know if it's a block issue or a private account issue
					elt.postId.posterId.isPrivate = undefined;
					return true;
				}

				// If the poster has a private acc
				if (isPrivate) {
					// Then we check if auth user is following the poster and vice versa
					if (!isAuthUserFollowingPoster) {
						return true;
					}
					if (!isAuthUserInPosterFollowers) {
						return true;
					}
				}

				return false;
			}

			// Calling the function to check if we need to hide or not the content
			if (shouldHideContent()) {
				elt.postId.text = undefined;
				elt.postId.media = undefined;
			}

			if (elt.postId !== null) {
				elt.postId.posterId.blockedUsers = undefined;
				elt.postId.posterId.followers = undefined;
			}
		}

		elt[path].blockedUsers = undefined;
		elt[path].followers = undefined;

		return elt;
	});

	return response;
}

exports.filterElement = (elt, path, authUser) => {
	const reason = { error: true };

	const isBlockedByAuthUser = authUser.blockedUsers.includes(elt[path]._id);

	const isBlockedByPoster = elt[path].blockedUsers.includes(authUser._id);

	const userIsPrivate = elt[path].isPrivate === true;

	const authUserIsFollowingUser = authUser.following.includes(elt[path]._id);

	const userIsFollowedByAuthUser = elt[path].followers.includes(authUser._id);

	if (isBlockedByAuthUser) {
		reason.message =
			"Impossible de voir la publication d'un utilisateur que vous avez bloqué";
		return reason;
	}
	if (isBlockedByPoster) {
		reason.message =
			"Impossible de voir la publication d'un utilisateur qui vous a bloqué";
		return reason;
	}
	if (userIsPrivate) {
		if (!authUserIsFollowingUser) {
			reason.message =
				"Cette publication vient d'un compte privé, veuillez suivre ce compte pour voir ses publications";
			return reason;
		}
		if (!userIsFollowedByAuthUser) {
			reason.message =
				"Cette publication vient d'un compte privé, veuillez suivre ce compte pour voir ses publications";
			return reason;
		}
	}

	elt[path].blockedUsers = undefined;
	elt[path].followers = undefined;

	return elt;
};
