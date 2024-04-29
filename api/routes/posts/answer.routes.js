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

router.get("/", authenticate, answerController.getAnswers);
// router.get("/:id", authenticate, answerController.getAnswer);

router.put(
	"/:id",
	authenticate,
	authorize,
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	answerController.updateAnswer
);

router.delete("/:id", authenticate, authorize, answerController.deleteAnswer);

// React to a post
router.patch(
	"/add-react/:id",
	authenticate,
	authorize,
	answerController.addReaction
);
router.patch(
	"/delete-react/:id",
	authenticate,
	authorize,
	answerController.deleteReaction
);

module.exports = router;
