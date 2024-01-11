const UserModel = require("../../models/users/User.model");
const CompanyModel = require("../../models/company/Company.model");
const { uploadFile, destroyFile } = require("../../helpers/cloudinaryManager");

exports.saveCompany = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const { name, activity, lookingForEmployees, bio, links } = req.body;
		const { memberId, role } = req.body;
		const picture = req.file;

		const user = await UserModel.findById({ _id: userId });

		if (!user) {
			return res.status(404).send({
				error: true,
				message: "Cet utilisateur n'existe pas",
			});
		}

		if (user.company) {
			return res.status(400).send({
				error: true,
				message:
					"Un utilisateur qui est dans une compagnie ne peut en créer une",
			});
		}

		if (user.worker) {
			return res.status(400).send({
				error: true,
				message: "Un utilisateur ne peut être worker et avoir une compagnie",
			});
		}

		const uploadResponse = await uploadFile(picture, "logo");

		const company = new CompanyModel({
			leaderId: userId,
			members: [
				{
					memberId: memberId,
					role: role,
				},
			],
			name: name,
			picture: picture ? uploadResponse : "",
			activity: activity,
			bio: bio,
			lookingForEmployees: lookingForEmployees,
			links: links,
		});

		const saveCompany = await company.save();

		await UserModel.findByIdAndUpdate(
			{ _id: userId },
			{
				$set: {
					company: saveCompany._id,
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		res.status(201).send(saveCompany);
	} catch (err) {
		return res.status(500).send({
			error: true,
			message: err.message || "Erreur interne du serveur",
		});
	}
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
