const multer = require("multer");

const storage = multer.memoryStorage({
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now());
	},
});

const fileFilter = (req, file, cb) => {
	// Accepted mimetype
	if (
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		// Reject the file
		cb(new multer.MulterError("LIMIT_FILE_TYPE"), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 2 * 1024 * 1024, // 2Mo maximum
	},
});

module.exports = upload;
