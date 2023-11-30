const ReportUserModel = require("../../models/users/ReportUser.model");

exports.saveReport = (req, res, next) => {
	const { reporterId, reportedUserId, reason, note } = req.body;

	const report = new ReportUserModel({
		reporterId: reporterId,
		reportedUserId: reportedUserId,
		reason: reason,
		note: note,
	});

	report
		.save()
		.then((report) => res.status(201).send(report))
		.catch((err) => res.status(500).send(err));
};

exports.getReports = (req, res, next) => {
	const { reportedUserId, status } = req.query;

	function searchReport() {
		if (reportedUserId) {
			console.log("both");
			return {
				reportedUserId: reportedUserId,
				status: status,
			};
		}
		if (status) {
			return {
				status: status,
			};
		}
	}

	ReportUserModel.find(searchReport())
		.populate(
			"reporterId reportedUserId",
			"firstName lastName picture userName"
		)
		.sort({ createdAt: "desc" })
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
	ReportUserModel.findOneAndDelete({
		_id: req.params.id,
		reporterId: req.query.userId,
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
