const router = require("express").Router();
const twitterController = require("../controllers/twitter/twitter.controllers");

router.get("/", twitterController.authorizeTwitterLink);
router.get("/callback", twitterController.getTwitterTokens);

router.post("/revoke/:id", twitterController.revokeTwitterTokens);

module.exports = router;
