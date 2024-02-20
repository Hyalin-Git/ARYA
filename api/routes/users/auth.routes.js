const router = require("express").Router();
const authController = require("../../controllers/users/auth.controllers");
const { authenticate } = require("../../middlewares/jwt.middleware");
const { userPictureUpload } = require("../../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../../utils/multerErrors");

// auth routes
router.post(
	"/signUp",
	userPictureUpload.fields([
		{ name: "logo", maxCount: 1 },
		{ name: "cv", maxCount: 1 },
	]),
	multerErrorsHandler,
	authController.signUp
);
router.post("/signIn", authController.signIn);
router.delete("/logout", authenticate, authController.logout);

// 2FA
router.post("/otp/generate", authController.generateOTP);
router.post("/otp/verify", authController.activateOTP);
router.post("/otp/validate", authController.validateOTP);
router.post("/otp/disable", authController.disableOTP);
router.post("/otp/delete", authController.deleteOTP);

router.post("/refresh-token", authController.refreshToken);

module.exports = router;
