const multer = require("multer");

const storage = multer.memoryStorage({
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now());
	},
});

const allowedMimetypes = [
	"image/jpg",
	"image/png",
	"image/jpeg",
	"image/gif",
	"application/pdf",
];

const fileFilter = (req, file, cb) => {
	// Accepted mimetype
	if (allowedMimetypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		// Reject the file
		cb(new multer.MulterError("LIMIT_FILE_TYPE"), false);
	}
};

// Users profil pictures & Company logo
const userPictureUpload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 2 * 1024 * 1024 }, // Limite de 2 Mo
});

// Posts & comments
const postUpload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 Mo
});

// Messages only
const messageUpload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 8 * 1024 * 1024 }, // Limite de 8 Mo
});

module.exports = { postUpload, userPictureUpload, messageUpload };
