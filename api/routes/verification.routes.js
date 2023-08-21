const router = require("express").Router();
const { authorization } = require("../middlewares/jwt.middleware");
const verificationController = require("../controllers/verification.controllers");

// Takes userId and token as parameters
router.put("/:id/verify/:token", verificationController.verifyEmailLink);
router.put(
	"/:id/new-email-verify/:token",
	verificationController.verifyNewEmailLink
);

// send verification mail route
router.post(
	"/send-verification-mail/:id",
	verificationController.checkUserVerification
);
// Verify the reset code
router.put("/reset-code-verify", verificationController.verifyResetCode);

module.exports = router;
