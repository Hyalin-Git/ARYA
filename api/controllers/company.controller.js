const UserModel = require("../models/user.model");
const CompanyModel = require("../models/Company.model");
const { resizeImageAndWebpConvert } = require("../utils/resizeImg");
const cloudinary = require("../config/cloudinary.config");

exports.saveCompany = (req, res, next) => {
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

			const logo = req.file;
			const resizedAndCovertedImg = await resizeImageAndWebpConvert(
				logo.buffer,
				200,
				200
			);

			cloudinary.uploader
				.upload_stream(
					{
						resource_type: "image",
						folder: "Arya/logo",
						public_id: `${user._id}`,
					},
					async (err, result) => {
						if (err) {
							// An error occurred while uploading the image to Cloudinary.
							return res.status(500).send({
								error: true,
								message:
									"Une erreur est survenue lors du téléchargement de l'image sur Cloudinary.",
							});
						}
						new CompanyModel({
							userId: user._id,
							name: req.body.name,
							logo: result.secure_url,
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
					}
				)
				.end(resizedAndCovertedImg);
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
	UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			if (!user) {
				return res.status(404).send("User does not exist");
			}

			const logo = req.file;

			const resizedAndCovertedImg = await resizeImageAndWebpConvert(
				logo.buffer,
				200,
				200
			);

			const deleteOldLogo = await cloudinary.uploader.destroy(
				`Arya/logo/${user._id}`
			);

			if (deleteOldLogo.result !== "ok") {
				return res
					.status(404)
					.send({ error: true, message: "Couldn't delete the specified Logo" });
			}

			cloudinary.uploader
				.upload_stream(
					{
						resource_type: "image",
						folder: "Arya/logo",
						public_id: `${user._id}`,
					},
					async (err, result) => {
						if (err) {
							// An error occurred while uploading the image to Cloudinary.
							return res.status(500).send({
								error: true,
								message:
									"Une erreur est survenue lors du téléchargement de l'image sur Cloudinary.",
							});
						}
						CompanyModel.findOneAndUpdate(
							{ userId: user._id },
							{
								$set: {
									name: req.body.name,
									logo: result.secure_url,
									activity: req.body.activity,
									lookingForEmployes: req.body.lookingForEmployes,
									bio: req.body.bio,
									websiteLink: req.body.websiteLink,
								},
							},
							{
								new: true,
							}
						)
							.then(async (company) => res.status(200).send(company))
							.catch((err) => res.status(500).send(err));
					}
				)
				.end(resizedAndCovertedImg);
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteCompany = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			if (!user) {
				return res.status(404).send("User does not exist");
			}

			const deletedLogo = await cloudinary.uploader.destroy(
				`Arya/logo/${user._id}`
			);

			if (deletedLogo.result !== "ok") {
				return res
					.status(404)
					.send({ error: true, message: "Couldn't delete the specified Logo" });
			}

			CompanyModel.findOneAndDelete({ userId: user._id })
				.then(() => {
					UserModel.findByIdAndUpdate(
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
					)
						.then((dqz) => res.status(200).send(dqz))
						.catch((err) => res.status(500).send(err));
				})
				.catch((err) => res.status(404).send(err));
		})
		.catch((err) => res.status(500).send(err));
};
