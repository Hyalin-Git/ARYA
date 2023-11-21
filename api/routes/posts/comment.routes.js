const router = require("express").Router();
const commentController = require("../../controllers/posts/comment.controller");
const { postUpload } = require("../../middlewares/multer.middleware");

const { multerErrorsHandler } = require("../../utils/multerErrors");

// CRUD
router.get("/", commentController.getComments);
router.get("/:id", commentController.getComment);

router.post(
	"/",
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
