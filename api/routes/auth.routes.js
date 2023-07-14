const router = require("express").Router();
const authController = require("../controllers/auth.controllers");
const { authorization } = require("../middlewares/jwt.middleware");

router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);
router.post("/logout", authorization, authController.logout);

router.post("/refresh-token", authController.refreshToken);

module.exports = router;
