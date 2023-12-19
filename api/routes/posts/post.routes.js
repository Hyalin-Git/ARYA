const router = require("express").Router();
const postController = require("../../controllers/posts/post.controllers");
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const {
	canAccessPosts,
} = require("../../middlewares/checkIfBlocked.middleware");
const { postUpload } = require("../../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../../utils/multerErrors");

// CRUD

router.post(
	"/",
	authenticate,
	authorize,
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	postController.savePost
);

router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);

router.put(
	"/:id",
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	postController.updatePost
);

router.delete("/:id", postController.deletePost);

// React to a post
router.patch(
	"/add-react/:id",
	authenticate,
	authorize,
	postController.addReaction
);
router.patch(
	"/delete-react/:id",
	authenticate,
	authorize,
	postController.deleteReaction
);

module.exports = router;
