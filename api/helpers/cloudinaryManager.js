const cloudinary = require("../config/cloudinary.config");
const { resizeImageAndWebpConvert } = require("../utils/resizeImg");

exports.uploadFile = async (picture, folder) => {
	try {
		const resizedAndCovertedImg = await resizeImageAndWebpConvert(
			picture.buffer,
			200,
			200
		);

		const uploadOptions = {
			resource_type: "image",
			folder: `Arya/${folder}`,
			use_filename: true,
		};

		const cloudinaryResponse = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(uploadOptions, async (err, result) => {
					if (err) reject(err);
					resolve(result);
				})
				.end(resizedAndCovertedImg);
		});

		return cloudinaryResponse.secure_url;
	} catch (err) {
		throw err;
	}
};

exports.uploadFiles = async (medias, folder) => {
	try {
		if (!medias) {
			return;
		}

		const uploadOptions = {
			resource_type: "image",
			folder: `Arya/${folder}`,
			use_filename: true,
		};

		const uploadMedias = medias.map(async (media) => {
			const resizedAndCovertedImg = await resizeImageAndWebpConvert(
				media.buffer
			);

			return await new Promise((resolve, reject) => {
				cloudinary.uploader
					.upload_stream(uploadOptions, async (err, result) => {
						if (err) reject(err);
						resolve(result);
					})
					.end(resizedAndCovertedImg);
			});
		});

		const cloudinaryResponse = await Promise.all(uploadMedias);

		return cloudinaryResponse.map((res) => res.secure_url);
	} catch (err) {
		throw err;
	}
};

exports.destroyFile = async (model, folder) => {
	try {
		const getFileName = model.picture.split("/")[9].split(".")[0];
		await cloudinary.uploader.destroy(`Arya/${folder}/${getFileName}`);
	} catch (err) {
		throw err;
	}
};

exports.destroyFiles = async (model, folder) => {
	try {
		model.media.map(async (file) => {
			const getFileName = file.split("/")[9].split(".")[0];
			await cloudinary.uploader.destroy(`Arya/${folder}/${getFileName}`);
		});
	} catch (err) {
		throw err;
	}
};
