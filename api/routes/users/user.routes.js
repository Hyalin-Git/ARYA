const router = require("express").Router();
const {
	authenticate,
	authorize,
	isBlocked,
} = require("../../middlewares/jwt.middleware");
const {
	checkUserPassword,
	checkIfUserVerified,
} = require("../../middlewares/userVerifications.middleware");
const { userPictureUpload } = require("../../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../../utils/multerErrors");

const userController = require("../../controllers/users/user.controllers");

router.get("/", authenticate, userController.getUsers);
router.get("/:id", authenticate, isBlocked, userController.getUser);
router.delete("/:id", userController.deleteOneUser);

// Update user picture
router.put(
	"/update-picture/:id",
	userPictureUpload.single("picture"),
	multerErrorsHandler,
	userController.updateUserPicture
);

// Update user bio
router.put(
	"/update-user/:id",
	authenticate,
	authorize,
	userController.updateUser
);
// Update user phone
router.put(
	"/update-phone/:id",
	checkIfUserVerified,
	userController.updateUserPhone
);

// Update email routes
router.post(
	"/email-reset/:id",
	checkUserPassword,
	checkIfUserVerified,
	userController.sendEmailResetLink
);

// Update user password route
router.put(
	"/password-reset/:id",
	checkUserPassword,
	checkIfUserVerified,
	userController.updateUserPassword // If the user want to update his password
);

// forgot passsword routes
router.post(
	"/forgot-password/reset-code/:id",
	userController.sendPasswordResetCode
);
router.put("/forgot-password/:id", userController.updateForgotPassword); // If the reset code is verified, then update the password

router.patch("/block/:id", userController.blockAnUser);
router.patch("/unblock/:id", userController.unblockAnUser);

router.get("/follow/:id", userController.getFollow);
router.get("/followers/:id", userController.getFollowers);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

module.exports = router;
