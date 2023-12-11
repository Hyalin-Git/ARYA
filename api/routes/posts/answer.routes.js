const router = require("express").Router();
const {
	authenticate,
	authorize,
} = require("../../middlewares/jwt.middleware.js");
const { postUpload } = require("../../middlewares/multer.middleware.js");
const { multerErrorsHandler } = require("../../utils/multerErrors.js");
const answerController = require("../../controllers/posts/answer.controller");

router.post(
	"/",
	authenticate,
	authorize,
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	answerController.saveAnswer
);

router.get("/", answerController.getAnswers);
router.get("/:id", answerController.getAnswer);

router.put(
	"/:id",
	authenticate,
	authorize,
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	answerController.updateAnswer
);

router.delete("/:id", authenticate, authorize, answerController.deleteAnswer);

// router.patch("/", authenticate, answerController.getAnswers);
// router.patch("/:id", authenticate, answerController.getAnswer);

module.exports = router;
