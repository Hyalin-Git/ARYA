const router = require("express").Router();
const postController = require("../controllers/post.controllers");
const { postUpload } = require("../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../utils/multerErrors");

// CRUD
router.get("/:id", postController.getPost);
router.get("/", postController.getPosts);

router.post(
	"/",
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	postController.sendPost
);

router.put(
	"/:id",
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	postController.updatePost
);

router.delete("/:id", postController.deletePost);

// React to a post
router.patch("/add-react/:id", postController.addReaction);
router.patch("/remove-react/:id", postController.deleteReaction);

module.exports = router;
