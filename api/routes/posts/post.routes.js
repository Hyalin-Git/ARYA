const router = require("express").Router();
const postController = require("../../controllers/posts/post.controllers");
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
	postController.savePost
);

router.get("/", authenticate, postController.getPosts);
router.get("/:id", authenticate, postController.getPost);

router.put(
	"/:id",
	authenticate,
	authorize,
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	postController.updatePost
);

router.delete("/:id", authenticate, authorize, postController.deletePost);

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
