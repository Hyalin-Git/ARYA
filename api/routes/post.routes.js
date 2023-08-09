const router = require("express").Router();
const { OAuthTokensHandler } = require("../middlewares/OAuth.middleware");
const postController = require("../controllers/post.controllers");
const upload = require("../middlewares/multer.middleware");

router.post("/", OAuthTokensHandler, postController.sendPost);
router.post("/scheduled", OAuthTokensHandler, postController.sendScheduledPost);

module.exports = router;
