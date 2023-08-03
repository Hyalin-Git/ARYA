const router = require("express").Router();

const postController = require("../controllers/post.controllers");

router.post("/", postController.sendPost);
router.post("/scheduled", postController.sendScheduledPost);

module.exports = router;
