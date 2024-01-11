const CompanyModel = require("../../models/company/Company.model");
const CompanyRequestModel = require("../../models/company/CompanyRequest.model");
const UserModel = require("../../models/users/User.model");

exports.saveCompanyRequest = async (req, res, next) => {
	try {
		const { toCompanyId, email, content, skills, cv, portfolio } = req.body;
		const { userId } = req.query;

		const user = await UserModel.findById({ _id: userId });
		if (!user) {
			return res.status(404).send({
				error: true,
				message:
					"Impossible de soumettre une requête à un compagnie avec un compte inexistant",
			});
		}

		if (user.company) {
			return res
				.status(400)
				.send({
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

exports.getCompanyRequests = (req, res, next) => {
	const { companyId, userId } = req.query;

	if (companyId & userId) {
		return res.status(400).send({ error: true, message: "" });
	}

	const filter = {};

	if (companyId) filter.toCompanyId = companyId;
	if (userId) filter.fromUserId = userId;

	CompanyRequestModel.find(filter)
		.then((companyRequest) => {
			if (!companyRequest && companyId) {
				return res.status(404).send({
					error: true,
					message: "Votre compagnie n'a reçu aucune requête pour le moment",
				});
			}
			if (!companyRequest && userId) {
				return res.status(404).send({
					error: true,
					message: "Vous n'avez postulé chez aucune compagnie pour le moment",
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
