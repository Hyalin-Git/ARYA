const ReportPostModel = require("../../models/posts/ReportPost.model");
const PostModel = require("../../models/posts/Post.model");

exports.saveReport = (req, res, next) => {
	const { reporterId, reportedPostId, reason, note } = req.body;

	PostModel.findById({ _id: reportedPostId })
		.then((post) => {
			if (!post) {
				return res
					.status(404)
					.send({ error: true, message: "Cet publication n'existe pas" });
			}

			const report = new ReportPostModel({
				reporterId: reporterId,
				reportedPostId: reportedPostId,
				reason: reason,
				note: note,
			});

			report
				.save()
				.then(async (report) => {
					const updatedPost = await PostModel.findByIdAndUpdate(
						{ _id: reportedPostId },
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
						.send({ signalement: report, updatedPost: updatedPost });
				})
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

exports.getReports = (req, res, next) => {
	const { reportedPostId, reason, status, sortBy } = req.query;

	function searchReport() {
		const search = {};

		if (reportedPostId) {
			search.reportedPostId = reportedPostId;
		}
		if (status) {
			search.status = status;
		}
		if (reason) {
			search.reason = reason;
		}

		return search;
	}

	ReportPostModel.find(searchReport())
		.populate(
			"reporterId reportedPostId",
			"firstName lastName picture userName posterId text media"
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
	ReportPostModel.findById({ _id: req.params.id })
		.populate(
			"reporterId reportedPostId",
			"firstName lastName picture userName posterId text media"
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

	ReportPostModel.findByIdAndUpdate(
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
	ReportPostModel.findByIdAndDelete({
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
