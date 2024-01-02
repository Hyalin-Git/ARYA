const router = require("express").Router();
const commentController = require("../../controllers/posts/comment.controller");
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");

const { postUpload } = require("../../middlewares/multer.middleware");

const { multerErrorsHandler } = require("../../utils/multerErrors");

// CRUD
router.post(
	"/",
	authenticate,
	authorize,
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	commentController.saveComment
);

router.get("/", authenticate, commentController.getComments);
router.get("/:id", authenticate, commentController.getComment);

router.put(
	"/:id",
	authenticate,
	authorize,
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	commentController.updateComment
);

router.delete("/:id", authenticate, authorize, commentController.deleteComment);

// React to a comment
router.patch(
	"/add-react/:id",
	authenticate,
	authorize,
	commentController.addReaction
);
router.patch(
	"/delete-react/:id",
	authenticate,
	authorize,
	commentController.deleteReaction
);

module.exports = router;
