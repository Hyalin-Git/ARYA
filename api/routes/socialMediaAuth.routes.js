const router = require("express").Router();
const socialMediaAuth = require("../controllers/socialMediaAuth.controllers");
const { authorization } = require("../middlewares/jwt.middleware");

// Twitter routes
router.get("/twitter", socialMediaAuth.authorizeTwitter);
router.get("/twitter/callback", socialMediaAuth.getTwitterTokens);

router.post("/twitter/refresh-tokens", socialMediaAuth.refreshTwitterToken);
router.post("/twitter/revoke", socialMediaAuth.revokeTokens);

module.exports = router;
