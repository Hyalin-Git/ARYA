const UserModel = require("../../models/users/User.model");
const CompanyModel = require("../../models/users/Company.model");
const { uploadFile, destroyFile } = require("../../helpers/cloudinaryManager");

exports.saveCompany = (req, res, next) => {
	const picture = req.file;
	UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			if (user.worker !== undefined) {
				return res.status(400).send({
					error: true,
					message: "User account cannot be worker and company at the same",
				});
			}
			if (!user) {
				return res.status(404).send("User does not exist");
			}

			const uploadResponse = await uploadFile(picture, "logo");

			new CompanyModel({
				userId: user._id,
				name: req.body.name,
				picture: picture ? uploadResponse : "",
				activity: req.body.activity,
				lookingForEmployes: req.body.lookingForEmployes,
				bio: req.body.bio,
				websiteLink: req.body.websiteLink,
			})
				.save()
				.then((company) => {
					UserModel.findByIdAndUpdate(
						{ _id: req.params.id },
						{
							$set: {
								company: company._id,
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

exports.getCompany = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.populate("company")
		.exec()
		.then((user) => {
			if (!user) {
				return res.status(404).send("User does not exist");
			}
			res.status(200).send(user.company);
		})
		.catch((err) => res.status(500).send(err));
};

exports.updateCompany = (req, res, next) => {
	const picture = req.file;
	UserModel.findById({ _id: req.params.id })
		.then((user) => {
			if (!user) {
				return res.status(404).send("User does not exist");
			}
			CompanyModel.findById({ _id: user.company })
				.then(async (company) => {
					if (!company) {
						return res.status(404).send("Company does not exist");
					}

					if (company.picture) {
						await destroyFile(company, "logo");
					}

					const uploadResponse = await uploadFile(picture, "logo");
					const updatedCompany = await CompanyModel.findOneAndUpdate(
						{ userId: user._id },
						{
							$set: {
								name: req.body.name,
								picture: picture ? uploadResponse : "",
								activity: req.body.activity,
								lookingForEmployes: req.body.lookingForEmployes,
								bio: req.body.bio,
								websiteLink: req.body.websiteLink,
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
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteCompany = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			if (!user) {
				return res.status(404).send("User does not exist");
			}

			CompanyModel.findOne({ userId: user._id })
				.then(async (company) => {
					await destroyFile(company, "logo");
					await CompanyModel.findByIdAndDelete({ _id: company._id });
					await UserModel.findByIdAndUpdate(
						{ _id: req.params.id },
						{
							$unset: {
								company: "",
							},
						},
						{
							new: true,
							setDefaultsOnInsert: true,
						}
					);

					return res.status(200).send(company);
				})
				.catch((err) => res.status(500).send(err.message ? err.message : err));
		})
		.catch((err) => res.status(500).send(err));
};
