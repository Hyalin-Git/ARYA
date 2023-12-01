const ReportUserModel = require("../../models/users/ReportUser.model");
const UserModel = require("../../models/users/User.model");

exports.saveReport = (req, res, next) => {
	const { reporterId, reportedUserId, reason, note } = req.body;

	UserModel.findById({ _id: reportedUserId })
		.then((user) => {
			if (!user) {
				return res
					.status(404)
					.send({ error: true, message: "Cet utilisateur n'existe pas" });
			}

			const report = new ReportUserModel({
				reporterId: reporterId,
				reportedUserId: reportedUserId,
				reason: reason,
				note: note,
			});

			report
				.save()
				.then(async (report) => {
					const updatedUser = await UserModel.findByIdAndUpdate(
						{ _id: reportedUserId },
						{
							$inc: {
								reported: 1,
							},
						},
						{
							new: true,
							setDefaultsOnInsert: true,
						}
					);

					res
						.status(201)
						.send({ signalement: report, updatedUser: updatedUser });
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

exports.getReports = (req, res, next) => {
	const { reportedUserId, reason, status, sortBy } = req.query;

	function searchReport() {
		const search = {};

		if (reportedUserId) {
			search.reportedUserId = reportedUserId;
		}
		if (status) {
			search.status = status;
		}
		if (reason) {
			search.reason = reason;
		}

		return search;
	}

	ReportUserModel.find(searchReport())
		.populate(
			"reporterId reportedUserId",
			"firstName lastName picture userName"
		)
		.sort({ createdAt: sortBy })
		.exec()
		.then((reports) => {
			if (reports <= 0) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun signalement n'a été trouvé" });
			}
			res.status(200).send(reports);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getReport = (req, res, next) => {
	ReportUserModel.findById({ _id: req.params.id })
		.populate(
			"reporterId reportedUserId",
			"firstName lastName picture userName"
		)
		.exec()
		.then((reports) => {
			if (!reports) {
				return res
					.status(404)
					.send({ error: true, message: "Aucun signalement n'a été trouvé" });
			}
			res.status(200).send(reports);
		})
		.catch((err) => res.status(500).send(err));
};

exports.updateReport = (req, res, next) => {
	const allowedStatus = ["En attente", "En cours", "Terminé"];

	if (!allowedStatus.includes(req.body.status)) {
		return res
			.status(400)
			.send({ error: true, message: "Le status fournit n'est pas autorisé" });
	}

	ReportUserModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				status: req.body.status,
			},
		},
		{
			setDefaultsOnInsert: true,
			new: true,
		}
	)
		.then((updatedReport) => {
			if (!updatedReport) {
				return res
					.status(404)
					.send({ error: true, message: "Le signalement est introuvable" });
			}
			res.status(200).send(updatedReport);
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteReport = (req, res, next) => {
	ReportUserModel.findByIdAndDelete({
		_id: req.params.id,
	})
		.then((deletedReport) => {
			if (!deletedReport) {
				return res
					.status(404)
					.send({ error: true, message: "Le signalement est introuvable" });
			}
			res.status(200).send(deletedReport);
		})
		.catch((err) => res.status(500).send(err));
};
