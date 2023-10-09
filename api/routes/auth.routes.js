const router = require("express").Router();
const authController = require("../controllers/auth.controllers");
const { authenticate } = require("../middlewares/jwt.middleware");

// auth routes
router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);
router.delete("/logout", authenticate, authController.logout);

// 2FA
router.post("/otp/generate", authController.generateOTP);
router.post("/otp/verify", authController.verifyOTP);
router.post("/otp/validate");
router.post("/otp/disable");

router.post("/refresh-token", authController.refreshToken);

module.exports = router;
