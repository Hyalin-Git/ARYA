const router = require("express").Router();
const { authorization } = require("../middlewares/jwt.middleware");
const verificationController = require("../controllers/verification.controller");

// Takes userId and token as parameters also takes "email" or "newEmail" as query
router.put("/:id/verify/:token", verificationController.verifyLink);

// send verification mail route
router.post(
	"/send-verification-mail/:id",
	verificationController.checkUserVerification
);

router.put("/reset-code-verify", verificationController.verifyResetCode);

module.exports = router;
