const router = require("express").Router();
const postController = require("../controllers/post.controllers");

router.get("/:id", postController.getPost);
router.get("/", postController.getPosts);

router.post("/", postController.sendPost);

router.put("/:id", postController.updatePost);
router.patch("/add-react/:id", postController.addReaction);
router.patch("/remove-react/:id", postController.removeReaction);

router.delete("/:id", postController.deletePost);

module.exports = router;
