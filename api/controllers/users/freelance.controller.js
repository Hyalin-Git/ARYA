const UserModel = require("../../models/users/User.model");
const WorkerModel = require("../../models/users/Freelance.model");
const {
	uploadFile,
	destroyFile,
	destroyPdfFile,
} = require("../../helpers/cloudinaryManager");

exports.saveWorker = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			if (!user) {
				return res.status(404).send("User does not exist");
			}
			if (user.company !== undefined) {
				return res.status(400).send({
					error: true,
					message: "User account cannot be worker and company at the same",
				});
			}

			const cv = req.file;

			const uploadResponse = cv ? await uploadFile(cv, "cv") : "";

			new WorkerModel({
				userId: user._id,
				cv: {
					pdf: uploadResponse,
					private: req.body.private,
				},
				// business: req.body.business,
				lookingForJob: req.body.lookingForJob,
				availability: req.body.availability,
			})
				.save()
				.then((freelance) => {
					UserModel.findByIdAndUpdate(
						{ _id: req.params.id },
						{
							$set: {
								freelance: freelance._id,
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
		.catch((err) => res.status(500).send(err.message));
};

exports.getWorker = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.populate("worker")
		.exec()
		.then((user) => {
			if (user.worker === undefined) {
				return res.status(404).send("Cet utilisateur n'existe pas");
			}
			if (!user) {
				return res.status(404).send("Cet utilisateur n'existe pas");
			}
			res.status(200).send(user.worker);
		})
		.catch((err) => res.status(500).send(err));
};

exports.updateWorker = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.populate("freelance")
		.exec()
		.then(async (user) => {
			if (!user) {
				return res.status(404).send("Cet utilisateur n'existe pas");
			}

			const cv = req.file;

			if (cv) {
				if (user.freelance?.cv?.pdf) {
					await destroyPdfFile(user, "cv");
				}
			}

			const uploadResponse = await uploadFile(cv, "cv");

			WorkerModel.findOneAndUpdate(
				{ userId: user._id },
				{
					$set: {
						cv: {
							pdf: uploadResponse ?? user?.freelance?.cv?.pdf,
							private: req.body.private ?? user?.freelance.private,
						},

						lookingForJob:
							req.body.lookingForJob ?? user?.freelance.lookingForJob,
						availability: req.body.availability ?? user?.freelance.availability,
					},
				},
				{
					new: true,
					setDefaultsOnInsert: true,
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
				return res.status(404).send("Cet utilisateur n'existe pas");
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
