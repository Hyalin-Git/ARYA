const router = require("express").Router();
const { OAuthTwitter } = require("../middlewares/OAuth.middleware");
const postController = require("../controllers/post.controllers");

router.post("/", OAuthTwitter, postController.sendPost);
router.post("/scheduled", OAuthTwitter, postController.sendScheduledPost);

module.exports = router;
