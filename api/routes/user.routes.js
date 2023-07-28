const router = require("express").Router();
const { authorization } = require("../middlewares/jwt.middleware");
const {
	checkUserPassword,
	checkIfUserVerified,
} = require("../middlewares/userVerifications.middleware");
const upload = require("../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../utils/multerErrors");

const userController = require("../controllers/user.controllers");

router.get("/", authorization, userController.getUsers);
router.get("/:id", authorization, userController.getUser);
router.delete("/:id", authorization, userController.deleteOneUser);

// Update user picture
router.put(
	"/:id/update-picture",
	upload.single("picture"),
	multerErrorsHandler,
	userController.updateUserPicture
);

// Update user bio
router.put(
	"/:id/update-bio",
	checkIfUserVerified,
	userController.updateUserBio
);
// Update user phone
router.put(
	"/:id/update-phone",
	checkIfUserVerified,
	userController.updateUserPhone
);

// Update email routes
router.post(
	"/:id/email-reset",
	checkUserPassword,
	checkIfUserVerified,
	userController.sendEmailResetLink
);

// Update user password route
router.put(
	"/:id/password-reset",
	checkUserPassword,
	checkIfUserVerified,
	userController.updateUserPassword // If the user want to update his password
);

// forgot passsword routes
router.post(
	"/:id/forgot-password/reset-code",
	userController.sendPasswordResetCode
); // Send the reset code to the user email
router.put("/:id/forgot-password", userController.updateForgotPassword); // If the reset code is verified, then update the password

module.exports = router;
