exports.errorsHandler = (model, params) => {
	try {
		switch (model) {
			case "posts":
				if (params.isPrivate) {
					throw new Error(
						"Impossible de voir la publication d'un compté privé, veuillez suivre l'utilisateur afin de voir la publication"
					);
				}
				if (params.PosterIsBlockedByAuth) {
					throw new Error(
						"Impossible de voir la publication d'un utilisateur que vous avez bloqué"
					);
				}
				break;
			default:
				message = "Erreur interne du serveur";
				break;
		}
	} catch (err) {
		return err.message || "Erreur interne du serveur";
	}
};
