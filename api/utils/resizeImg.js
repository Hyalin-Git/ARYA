const sharp = require("sharp");

exports.resizeImageAndWebpConvert = (fileBuffer, maxWidth, maxHeight) => {
	try {
		return sharp(fileBuffer)
			.resize(maxWidth, maxHeight)
			.webp({ lossless: true })
			.toBuffer();
	} catch (err) {
		throw err;
	}
};
