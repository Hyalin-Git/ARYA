const TaskModel = require("../../models/users/Task.model");
const moment = require("moment");

exports.addTask = (req, res, next) => {
	let date = moment();

	if (
		req.body.status !== "En attente" &&
		req.body.status !== "En cours" &&
		req.body.status !== "Terminé"
	) {
		return res
			.status(400)
			.send({ error: true, message: "Les paramètres fournit sont invalides" });
	}

	if (req.body.days || req.body.months) {
		date
			.add(req.body.days ? req.body.days : "", "d")
			.add(req.body.months ? req.body.months : "", "M");
	}

	const task = new TaskModel({
		userId: req.body.userId,
		title: req.body.title,
		content: req.body.content,
		price: req.body.price,
		software: req.body.software,
		customers: req.body.customers,
		startingDate: Date.now(),
		endingDate: date.format(),
		status: req.body.status,
		priority: req.body.priority,
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

exports.updateTask = (req, res, next) => {
	TaskModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				title: req.body.title,
				content: req.body.content,
				price: req.body.price,
				software: req.body.software,
				customers: req.body.customers,
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
