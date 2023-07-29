const router = require("express").Router();

const postController = require("../controllers/post.controller");

router.post("/", postController.sendPost);
router.post("/scheduled", postController.sendScheduledPost);

module.exports = router;
