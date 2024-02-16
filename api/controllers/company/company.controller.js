const UserModel = require("../../models/users/User.model");
const CompanyModel = require("../../models/company/Company.model");
const { uploadFile, destroyFile } = require("../../helpers/cloudinaryManager");

exports.saveCompany = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const { name, activity, lookingForEmployees, bio, links } = req.body;
		const logo = req.file;

		const user = await UserModel.findById({ _id: userId });

		if (!user) {
			return res.status(404).send({
				error: true,
				message: "Cet utilisateur n'existe pas",
			});
		}

		if (user.company) {
			return res.status(400).send({
				error: true,
				message:
					"Un utilisateur qui est dans une compagnie ne peut en créer une",
			});
		}

		if (user.worker) {
			return res.status(400).send({
				error: true,
				message: "Un utilisateur ne peut être worker et avoir une compagnie",
			});
		}

		const uploadResponse = await uploadFile(logo, "logo");

		const company = new CompanyModel({
			leaderId: userId,
			name: name,
			logo: logo ? uploadResponse : "",
			activity: activity,
			bio: bio,
			lookingForEmployees: lookingForEmployees,
			links: links,
		});

		const saveCompany = await company.save();

		await UserModel.findByIdAndUpdate(
			{ _id: userId },
			{
				$set: {
					company: saveCompany._id,
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		res.status(201).send(saveCompany);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.getCompanies = (req, res, next) => {
	// need to add filters and sorting methods

	CompanyModel.find()
		.then((companies) => {
			if (companies.length <= 0) {
				return res.status(404).send("User does not exist");
			}
			res.status(200).send(companies);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getCompany = (req, res, next) => {
	CompanyModel.findById({ _id: req.params.id })
		.then((company) => {
			if (!company) {
				return res.status(404).send({
					error: true,
					message: `La compagnie avec ID : ${req.params.id} n'existe pas`,
				});
			}
			res.status(200).send(company);
		})
		.catch((err) => res.status(500).send(err));
};

exports.updateCompany = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const { name, activity, lookingForEmployees, bio, links } = req.body;
		const picture = req.file;

		CompanyModel.findById({ _id: req.params.id })
			.then(async (company) => {
				if (!company) {
					return res
						.status(404)
						.send(`La compagnie avec ID : ${req.params.id} n'existe pas`);
				}

				const theMember = company.members.find((member) =>
					member.memberId.equals(userId)
				);

				if (company.leaderId.toString() !== userId && !theMember) {
					return res.status(403).send({
						error: true,
						message:
							"Accès refusé: l'utilisateur ne fait pas partie de la compagnie",
					});
				}

				if (theMember) {
					if (theMember.role !== "moderator") {
						return res.status(403).send({
							error: true,
							message:
								"Accès refusé: l'utilisateur n'a pas les droits requis pour effectuer cet action",
						});
					}
				}

				if (company.picture) {
					await destroyFile(company, "logo");
				}

				const uploadResponse = await uploadFile(picture, "logo");

				const updatedCompany = await CompanyModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							name: name,
							picture: picture ? uploadResponse : "",
							activity: activity,
							lookingForEmployees: lookingForEmployees,
							bio: bio,
							links: links,
						},
					},
					{
						setDefaultsOnInsert: true,
						new: true,
					}
				);

				return res.status(200).send(updatedCompany);
			})
			.catch((err) => res.status(500).send(err));
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.deleteCompany = async (req, res, next) => {
	try {
		const { userId } = req.query;

		const company = await CompanyModel.findOne({
			_id: req.params.id,
			leaderId: userId,
		});

		if (!company) {
			return res.status(404).send({
				error: true,
				message: "Aucune compagnie trouvé avec les paramètres fournit",
				params: {
					_id: req.params.id,
					leaderId: userId,
				},
			});
		}

		if (company.picture) {
			await destroyFile(company, "logo");
		}

		const deletedCompany = await CompanyModel.findOneAndDelete({
			_id: req.params.id,
			leaderId: userId,
		});

		for (const member of company.members) {
			await UserModel.findByIdAndUpdate(
				{ _id: member.memberId },
				{
					$unset: {
						company,
					},
				}
			);
		}

		await UserModel.findByIdAndUpdate(
			{ _id: userId },
			{
				$unset: {
					company,
				},
			}
		);

		return res.status(200).send(deletedCompany);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.addMembers = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const { memberId, role } = req.body;

		if (!memberId || !role) {
			return res.status(400).send({
				error: true,
				message:
					"Impossible d'effectuer la requête un ou plusieurs paramètres sont manquants",
				params: {
					memberId: memberId,
					role: role,
				},
			});
		}

		const company = await CompanyModel.find({ _id: req.params.id });

		if (!company) {
			return res.status(404).send({
				error: true,
				message: "Aucune compagnie trouvé avec le paramètre fournit",
				params: {
					_id: req.params.id,
				},
			});
		}

		const theMember = company.members.find((member) =>
			member.memberId.equals(userId)
		);

		if (company.leaderId.toString() !== userId && !theMember) {
			return res.status(403).send({
				error: true,
				message:
					"Accès refusé: l'utilisateur ne fait pas partie de la compagnie",
			});
		}

		if (theMember) {
			if (theMember.role !== "moderator") {
				return res.status(403).send({
					error: true,
					message:
						"Accès refusé: l'utilisateur n'a pas les droits requis pour effectuer cet action",
				});
			}
		}

		// const updatedCompany = await CompanyModel.findByIdAndUpdate({_id: req.params.id}, {
		// 	$addToSet: {
		// 		members: {

		// 		}
		// 	}
		// })
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.removeMember = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const { memberId } = req.body;

		const company = await CompanyModel.findById({ _id: req.params.id });

		if (!company) {
			return res.status(404).send({
				error: true,
				message: "Aucune compagnie trouvé avec le paramètre fournit",
				params: {
					_id: req.params.id,
				},
			});
		}

		const theMember = company.members.find((member) =>
			member.memberId.equals(userId)
		);

		if (company.leaderId.toString() !== userId && !theMember) {
			return res.status(403).send({
				error: true,
				message:
					"Accès refusé: l'utilisateur ne fait pas partie de la compagnie",
			});
		}

		if (theMember) {
			if (theMember.role !== "moderator") {
				return res.status(403).send({
					error: true,
					message:
						"Accès refusé: l'utilisateur n'a pas les droits requis pour effectuer cet action",
				});
			}
		}

		const updatedCompany = await CompanyModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$pull: {
					members: {
						memberId: memberId,
					},
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		await UserModel.findByIdAndUpdate(
			{ _id: memberId },
			{
				$set: { company: "" },
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		// Still needs to send a notif but will see with socket.io

		return res.status(200).send(updatedCompany);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};

exports.patchRole = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const { memberId, role } = req.body;
		const allowedRoles = ["moderator", "recruiter", "worker"];

		if (!allowedRoles.includes(role)) {
			return res.status(400).send({
				error: true,
				message: "Le paramètre fournit est invalide",
				params: { role: role },
			});
		}

		const company = await CompanyModel.findOne({
			_id: req.params.id,
			leaderId: userId,
		});

		if (!company) {
			return res.status(404).send({
				error: true,
				message: "Aucune compagnie trouvé avec les paramètres fournit",
				params: {
					_id: req.params.id,
					leaderId: userId,
				},
			});
		}

		const theMember = company.members.find((member) =>
			member.memberId.equals(memberId)
		);

		if (!theMember) {
			return res.status(404).send({
				error: true,
				message: ` Aucun membre avec cet ID : ${memberId} n'a été trouvé`,
			});
		}

		if (theMember.role === role) {
			return res.status(200).send(company);
		}

		theMember.role = role;

		await company.save();

		res.status(200).send(company);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
};
