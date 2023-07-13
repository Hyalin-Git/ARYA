const router = require("express").Router();
const authController = require("../controllers/auth.controllers");

router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);

router.post("/refresh-token", authController.refreshToken);

module.exports = router;
