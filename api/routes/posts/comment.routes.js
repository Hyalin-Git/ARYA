const router = require("express").Router();
const commentController = require("../../controllers/posts/comment.controller");
const {
	authenticate,
	authorize,
	isBlocked,
} = require("../../middlewares/jwt.middleware");
const {
	canAccessComments,
} = require("../../middlewares/checkIfBlocked.middleware");
const { postUpload } = require("../../middlewares/multer.middleware");

const { multerErrorsHandler } = require("../../utils/multerErrors");

// CRUD
router.get("/", authenticate, canAccessComments, commentController.getComments);
router.get("/:id", commentController.getComment);

router.post(
	"/",
	authenticate,
	authorize,
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	commentController.addComment
);

router.put(
	"/:id",
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	commentController.editComment
);

router.delete("/:id", commentController.deleteComment);

// React to a comment
router.patch("/add-react/:id", commentController.addReaction);
router.patch("/delete-react/:id", commentController.deleteReaction);

module.exports = router;
