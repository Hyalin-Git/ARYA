const router = require("express").Router();
const { authenticate } = require("../../middlewares/jwt.middleware");
const feedController = require("../../controllers/posts/feed.controller");

router.get("/", authenticate, feedController.getAllFeed);
router.get("/for-me", authenticate, feedController.getByFollowingFeed);

module.exports = router;
