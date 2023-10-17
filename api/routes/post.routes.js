const router = require("express").Router();
const postController = require("../controllers/post.controllers");
const upload = require("../middlewares/multer.middleware");

const { multerErrorsHandler } = require("../utils/multerErrors");

router.get("/:id", postController.getPost);
router.get("/", postController.getPosts);

router.post(
	"/",
	upload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	postController.sendPost
);

router.put("/:id", postController.updatePost);

router.patch("/add-react/:id", postController.addReaction);
router.patch("/remove-react/:id", postController.removeReaction);

router.patch("/add-comment/:id", postController.addComment);
router.patch("/edit-comment/:id", postController.editComment);
router.patch("/delete-comment/:id", postController.deleteComment);

router.delete("/:id", postController.deletePost);

module.exports = router;
