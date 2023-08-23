const router = require("express").Router();

const facebookController = require("../controllers/facebook/facebook.controllers");

router.get("/", facebookController.authorizeFacebookLink);
router.get("/callback", facebookController.getFacebookTokens);

router.get("/refresh", facebookController.facebookRefresh);

module.exports = router;
