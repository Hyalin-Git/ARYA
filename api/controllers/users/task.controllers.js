const { getFormattedDates } = require("../../helpers/formattingDates");
const TaskModel = require("../../models/users/Task.model");
const moment = require("moment");

exports.addTask = (req, res, next) => {
	let startingDate = moment();
	let endingDate = moment();

	// Getting filled dates informations
	const { startingMonth, startingDay, startingYear } = req.body;
	const { endingMonth, endingDay, endingYear } = req.body;

	const startingDateFormat = getFormattedDates(
		startingDate,
		startingYear,
		startingMonth,
		startingDay
	);
	const endingDateFormat = getFormattedDates(
		endingDate,
		endingYear,
		endingMonth,
		endingDay
	);

	const allowedStatus = ["En attente", "En cours", "Terminé"];
	// If the given status isn't in the allowedStatus array then return an error
	if (!allowedStatus.includes(req.body.status)) {
		return res
			.status(400)
			.send({ error: true, message: "Les paramètres fournit sont invalides" });
	}

	const task = new TaskModel({
		userId: req.body.userId,
		title: req.body.title,
		content: req.body.content,
		price: req.body.price,
		software: req.body.software,
		customers: req.body.customers,
		startingDate: startingDateFormat,
		endingDate: endingDateFormat,
		status: req.body.status,
		priority: req.body.priority,
		devisLink: req.body.devisLink,
		factureLink: req.body.factureLink,
	});

	task
		.save()
		.then((task) => res.status(201).send(task))
		.catch((err) => res.status(500).send(err));
};

exports.getTask = (req, res, next) => {
	TaskModel.findById({ _id: req.params.id })
		.then((task) => {
			if (!task) {
				return res
					.status(404)
					.send({ error: true, message: "Cette tâche est introuvable" });
			}
			res.status(200).send(task);
		})
		.catch((err) => res.status(500).send(err));
};

exports.getTasks = (req, res, next) => {
	TaskModel.find({ userId: req.body.userId })
		.populate("customers", "userName picture")
		.exec()
		.then((task) => {
			if (task <= 0) {
				return res
					.status(404)
					.send({ error: true, message: "Cette tâche est introuvable" });
			}
			res.status(200).send(task);
		})
		.catch((err) => res.status(500).send(err));
};

exports.updateTask = async (req, res, next) => {
	let startingDate = moment();
	let endingDate = moment();

	// Getting filled dates informations
	const { startingMonth, startingDay, startingYear } = req.body;
	const { endingMonth, endingDay, endingYear } = req.body;

	const startingDateFormat = getFormattedDates(
		startingDate,
		startingYear,
		startingMonth,
		startingDay
	);
	const endingDateFormat = getFormattedDates(
		endingDate,
		endingYear,
		endingMonth,
		endingDay
	);

	const allowedStatus = ["En attente", "En cours", "Terminé"];
	// If the given status isn't in the allowedStatus array then return an error
	if (!allowedStatus.includes(req.body.status)) {
		return res
			.status(400)
			.send({ error: true, message: "Les paramètres fournit sont invalides" });
	}

	TaskModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				title: req.body.title,
				content: req.body.content,
				price: req.body.price,
				software: req.body.software,
				customers: req.body.customers,
				startingDate: startingDateFormat,
				endingDate: endingDateFormat,
				status: req.body.status,
				priority: req.body.priority,
				devisLink: req.body.devisLink,
				factureLink: req.body.factureLink,
			},
		},
		{
			setDefaultsOnInsert: true,
			new: true,
		}
	)
		.then((updatedTask) => {
			if (!updatedTask) {
				return res.status(404).send({
					error: true,
					message: "Impossible de mettre à jour une tâche qui n'existe pas",
				});
			}
			res.status(200).send(updatedTask);
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteTask = (req, res, next) => {
	TaskModel.findByIdAndDelete({ _id: req.params.id })
		.then((deletedTask) => {
			if (!deletedTask) {
				return res.status(404).send({
					error: true,
					message: "Impossible de supprimer une tâche qui n'existe pas",
				});
			}
			res.status(200).send(deletedTask);
		})
		.catch((err) => res.status(500).send(err));
};
