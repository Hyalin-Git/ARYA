const multer = require("multer");
// Multer errors handler
exports.multerErrorsHandler = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		switch (err.code) {
			// If file size exceeds 2mo
			case "LIMIT_FILE_SIZE":
				res.status(400).json({
					error: true,
					message: "La taille du fichier dépasse la limite",
				});
				break;
			// If file isn't an image
			case "LIMIT_FILE_TYPE":
				res.status(400).json({
					error: true,
					message:
						"Le type du fichier est invalide, seulement les images sont acceptées",
				});
				break;
			case "LIMIT_UNEXPECTED_FILE":
				res.status(400).json({
					error: true,
					message: "Seulement un maximum de 4 fichiers est accepté",
				});
				break;
			default:
				res.status(500).json({ error: true, message: "Server Error" });
				break;
		}
	} else {
		next(err);
	}
};
