const router = require("express").Router();
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const workerController = require("../../controllers/users/freelance.controller");
const { userPictureUpload } = require("../../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../../utils/multerErrors");
router.post(
	"/:id",
	authenticate,
	authorize,
	userPictureUpload.single("cv"),
	multerErrorsHandler,
	workerController.saveWorker
);

router.get("/:id", workerController.getWorker);

router.put("/:id", workerController.updateWorker);

router.delete("/:id", workerController.deleteWorker);

module.exports = router;
