const router = require("express").Router();
const feedController = require("../../controllers/posts/feed.controller");

router.get("/", feedController.getAllFeed);
// router.get("/for-me", feedController.getByFollowingFeed);

module.exports = router;
