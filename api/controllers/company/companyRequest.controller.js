const CompanyModel = require("../../models/company/Company.model");
const CompanyRequestModel = require("../../models/company/CompanyRequest.model");
const UserModel = require("../../models/users/User.model");

// Company

exports.getCompanyRequests = async (req, res, next) => {
	try {
		const { userId } = req.query;

		const company = await CompanyModel.findOne({
			$or: [{ leaderId: userId }, { "members.memberId": { $in: userId } }],
		});

		if (!company) {
			return res.status(403).send({
				error: true,
				message:
					"Accès refusé: L'utilisateur ne fait pas partie de la compagnie",
			});
		}

		const theMember = company.members.find((member) =>
			member.memberId.equals(userId)
		);

		if (theMember) {
			if (theMember.role !== "recruiter") {
				return res.status(403).send({
					error: true,
					message:
						"Accès refusé: L'utilisateur n'a pas les droits requis pour effectuer cet action",
				});
			}
		}

		const companyRequest = await CompanyRequestModel.find({
			toCompanyId: company._id,
		});

		if (companyRequest.length <= 0) {
			return res.status(404).send({
				error: true,
				message: "Votre compagnie n'a reçu aucune demande pour le moment",
			});
		}

		res.status(200).send(companyRequest);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.getCompanyRequest = async (req, res, next) => {
	try {
		const { userId } = req.query;

		const company = await CompanyModel.findOne({
			$or: [{ leaderId: userId }, { "members.memberId": { $in: userId } }],
		});

		if (!company) {
			return res.status(403).send({
				error: true,
				message:
					"Accès refusé: L'utilisateur ne fait pas partie de la compagnie",
			});
		}

		const theMember = company.members.find((member) =>
			member.memberId.equals(userId)
		);

		if (theMember) {
			if (theMember.role !== "recruiter") {
				return res.status(403).send({
					error: true,
					message:
						"Accès refusé: L'utilisateur n'a pas les droits requis pour effectuer cet action",
				});
			}
		}

		const companyRequest = await CompanyRequestModel.findOne({
			_id: req.params.id,
			toCompanyId: company._id,
		});

		if (!companyRequest) {
			return res.status(404).send({
				error: true,
				message: "Impossible de récupérer une demande inexistante",
			});
		}

		res.status(200).send(companyRequest);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.progressCompanyRequest = async (req, res, next) => {
	try {
		const { userId } = req.query;

		const company = await CompanyModel.findOne({
			$or: [{ leaderId: userId }, { "members.memberId": { $in: userId } }],
		});

		if (!company) {
			return res.status(403).send({
				error: true,
				message:
					"Accès refusé: L'utilisateur ne fait pas partie de la compagnie",
			});
		}

		const theMember = company.members.find((member) =>
			member.memberId.equals(userId)
		);

		if (theMember) {
			if (theMember.role !== "recruiter") {
				return res.status(403).send({
					error: true,
					message:
						"Accès refusé: L'utilisateur n'a pas les droits requis pour effectuer cet action",
				});
			}
		}

		const companyRequest = await CompanyRequestModel.findOne({
			_id: req.params.id,
			toCompanyId: company._id,
		});

		if (companyRequest.status === "accepted") {
			return res.status(400).send({
				error: true,
				message: "Impossible de changer le status d'une demande déjà accepté",
			});
		}

		const updatedCompanyRequest = await CompanyRequestModel.findOneAndUpdate(
			{
				_id: req.params.id,
				toCompanyId: company._id,
			},
			{
				$set: {
					status: "progress",
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		res.status(200).send(updatedCompanyRequest);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.acceptCompanyRequest = async (req, res, next) => {
	try {
		const { userId } = req.query;

		const company = await CompanyModel.findOne({
			$or: [{ leaderId: userId }, { "members.memberId": { $in: userId } }],
		});

		if (!company) {
			return res.status(403).send({
				error: true,
				message:
					"Accès refusé: L'utilisateur ne fait pas partie de la compagnie",
			});
		}

		const theMember = company.members.find((member) =>
			member.memberId.equals(userId)
		);

		if (theMember) {
			if (theMember.role !== "recruiter") {
				return res.status(403).send({
					error: true,
					message:
						"Accès refusé: L'utilisateur n'a pas les droits requis pour effectuer cet action",
				});
			}
		}

		const companyRequest = await CompanyRequestModel.findOneAndUpdate(
			{
				_id: req.params.id,
				toCompanyId: company._id,
			},
			{
				$set: {
					status: "accepted",
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		const user = await UserModel.findById({ _id: companyRequest.fromUserId });

		if (user.company) {
			return res.status(400).send({
				error: true,
				message:
					"Impossible d'accepter la demande, l'utilisateur fait déjà partie d'une compagnie",
			});
		}

		const updatedCompany = await CompanyModel.findByIdAndUpdate(
			{ _id: company._id },
			{
				$addToSet: {
					members: {
						memberId: companyRequest.fromUserId,
						role: "worker",
					},
				},
			}
		);

		res.status(200).send(updatedCompany);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.declineCompanyRequest = async (req, res, next) => {
	try {
		const { userId } = req.query;

		const company = await CompanyModel.findOne({
			$or: [{ leaderId: userId }, { "members.memberId": { $in: userId } }],
		});

		if (!company) {
			return res.status(403).send({
				error: true,
				message:
					"Accès refusé: L'utilisateur ne fait pas partie de la compagnie",
			});
		}

		const theMember = company.members.find((member) =>
			member.memberId.equals(userId)
		);

		if (theMember) {
			if (theMember.role !== "recruiter") {
				return res.status(403).send({
					error: true,
					message:
						"Accès refusé: L'utilisateur n'a pas les droits requis pour effectuer cet action",
				});
			}
		}

		const companyRequest = await CompanyRequestModel.findOne({
			_id: req.params.id,
			toCompanyId: company._id,
		});

		if (companyRequest.status === "accepted") {
			return res.status(400).send({
				error: true,
				message: "Impossible de changer le status d'une demande déjà accepté",
			});
		}

		const updatedCompanyRequest = await CompanyRequestModel.findOneAndUpdate(
			{
				_id: req.params.id,
				toCompanyId: company._id,
			},
			{
				$set: {
					status: "declined",
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		res.status(200).send(updatedCompanyRequest);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

// Users

exports.saveCompanyRequest = async (req, res, next) => {
	try {
		const { toCompanyId, email, content, skills, cv, portfolio } = req.body;
		const { userId } = req.query;

		const user = await UserModel.findById({ _id: userId });

		if (user.company) {
			return res.status(400).send({
				error: true,
				message:
					"Impossible de soumettre une requête à une compagnie quand vous faites déjà partie d'une compagnie",
			});
		}

		const company = await CompanyModel.findById({ _id: toCompanyId });
		if (!company) {
			return res.status(404).send({
				error: true,
				message:
					"Impossible de soumettre une requête à un compagnie inexistante",
			});
		}

		const companyRequest = new CompanyRequestModel({
			fromUserId: user._id,
			toCompanyId: company._id,
			email: email,
			content: content,
			skills: skills,
			cv: cv,
			portfolio: portfolio,
		});

		const savedCompanyRequest = await companyRequest.save();

		return res.status(200).send(savedCompanyRequest);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.getUserCompanyRequests = (req, res, next) => {
	const { userId, status, sortBy } = req.query;
	const filter = { fromUserId: userId };

	if (status === "pending") filter.status = "pending";
	if (status === "progress") filter.status = "progress";
	if (status === "accepted") filter.status = "accepted";
	if (status === "declined") filter.status = "declined";

	CompanyRequestModel.find(filter)
		.sort({ createdAt: sortBy })
		.then((companyRequests) => {
			if (companyRequests.length <= 0) {
				return res.status(404).send({
					error: true,
					message: "Vous n'avez envoyé aucune demande pour le moment",
				});
			}
			res.status(200).send(companyRequests);
		})
		.catch((err) =>
			res.status(500).send({
				error: true,
				message: err.message || "Erreur interne du serveur",
			})
		);
};

exports.getUserCompanyRequest = (req, res, next) => {
	const { userId } = req.query;

	CompanyRequestModel.findOne({ _id: req.params.id, fromUserId: userId })
		.then((companyRequest) => {
			if (!companyRequest) {
				return res.status(404).send({
					error: true,
					message: "Impossible de récupérer une demande inexistante",
				});
			}
			res.status(200).send(companyRequest);
		})
		.catch((err) =>
			res.status(500).send({
				error: true,
				message: err.message || "Erreur interne du serveur",
			})
		);
};

exports.updateCompanyRequest = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const { email, content, skills, cv, portfolio } = req.body;

		const companyRequest = await CompanyRequestModel.findOne({
			_id: req.params.id,
			fromUserId: userId,
		});

		if (!companyRequest) {
			return res.status(404).send({
				error: true,
				message: "Impossible de mettre à jour une demande inexistante",
			});
		}

		if (companyRequest.status !== "pending") {
			return res.status(400).send({
				error: true,
				message:
					"Impossible de mettre à jour une demande déjà traité ou en cours de traitement",
			});
		}

		const updatedCompanyRequest = await CompanyRequestModel.findOneAndUpdate(
			{
				_id: req.params.id,
				fromUserId: userId,
			},
			{
				$set: {
					email: email,
					content: content,
					skills: skills,
					cv: cv,
					portfolio: portfolio,
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		res.status(200).send(updatedCompanyRequest);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.deleteCompanyRequest = async (req, res, next) => {
	try {
		const { userId } = req.query;

		const companyRequest = await CompanyRequestModel.findOne({
			_id: req.params.id,
			fromUserId: userId,
		});

		if (!companyRequest) {
			return res.status(404).send({
				error: true,
				message: "Impossible de supprimer une demande inexistante",
			});
		}

		if (companyRequest.status !== "pending") {
			return res.status(400).send({
				error: true,
				message:
					"Impossible de supprimer une demande déjà traité ou en cours de traitement",
			});
		}

		const deletedCompanyRequest = await CompanyRequestModel.findOneAndDelete({
			_id: req.params.id,
			fromUserId: userId,
		});

		res.status(200).send(deletedCompanyRequest);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};
