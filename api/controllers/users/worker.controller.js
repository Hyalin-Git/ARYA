const UserModel = require("../../models/users/User.model");
const WorkerModel = require("../../models/users/Worker.model");

exports.saveWorker = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((user) => {
			if (user.company !== undefined) {
				return res.status(400).send({
					error: true,
					message: "User account cannot be worker and company at the same",
				});
			}
			if (!user) {
				return res.status(404).send("User does not exist");
			}
			new WorkerModel({
				workerId: user._id,
				cv: req.body.cv,
				portfolio: req.body.portfolio,
				business: req.body.business,
				lookingForJob: req.body.lookingForJob,
			})
				.save()
				.then((worker) => {
					UserModel.findByIdAndUpdate(
						{ _id: req.params.id },
						{
							$set: {
								worker: worker._id,
							},
						},
						{
							new: true,
							setDefaultsOnInsert: true,
						}
					)
						.then((updated) => res.status(200).send(updated))
						.catch((err) => res.status(500).send(err));
				})
				.catch((err) => {
					if (err.code === 11000)
						return res
							.status(409)
							.send({ error: true, message: "Duplicate record" });
					res.status(500).send(err);
				});
		})
		.catch((err) => res.status(500).send(err));
};

exports.getWorker = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.populate("worker")
		.exec()
		.then((user) => {
			if (user.worker === undefined) {
				return res.status(404).send("User does not exist");
			}
			if (!user) {
				return res.status(404).send("User does not exist");
			}
			res.status(200).send(user.worker);
		})
		.catch((err) => res.status(500).send(err));
};

exports.updateWorker = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((user) => {
			if (!user) {
				return res.status(404).send("User does not exist");
			}
			WorkerModel.findOneAndUpdate(
				{ workerId: user._id },
				{
					$set: {
						cv: req.body.cv,
						portfolio: req.body.portfolio,
						business: req.body.business,
						lookingForJob: req.body.lookingForJob,
					},
				},
				{
					new: true,
				}
			)
				.then((worker) => res.status(200).send(worker))
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteWorker = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((user) => {
			if (!user) {
				return res.status(404).send("User does not exist");
			}
			WorkerModel.findOneAndDelete({ workerId: user._id })
				.then(() => {
					UserModel.findByIdAndUpdate(
						{ _id: req.params.id },
						{
							$unset: {
								worker: "",
							},
						},
						{
							new: true,
							setDefaultsOnInsert: true,
						}
					)
						.then((dqz) => res.status(200).send(dqz))
						.catch((err) => res.status(500).send(err));
				})
				.catch((err) => res.status(404).send(err));
		})
		.catch((err) => res.status(500).send(err));
};
