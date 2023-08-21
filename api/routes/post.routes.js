const router = require("express").Router();
const { OAuthTokensHandler } = require("../middlewares/OAuth.middleware");
const postController = require("../controllers/post.controllers");

router.post("/", OAuthTokensHandler, postController.sendPost);
router.post("/scheduled", OAuthTokensHandler, postController.sendScheduledPost);

module.exports = router;
