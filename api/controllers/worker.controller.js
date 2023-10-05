const UserModel = require("../models/user.model");
const WorkerModel = require("../models/Worker.model");

exports.saveWorker = (req, res, next) => {
	new WorkerModel({
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
		.catch((err) => res.status(500).send(err));
};
