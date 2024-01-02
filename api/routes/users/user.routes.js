const router = require("express").Router();
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const { isBlocked } = require("../../middlewares/checkIfBlocked.middleware");
const {
	checkUserPassword,
	checkIfUserVerified,
} = require("../../middlewares/userVerifications.middleware");
const { userPictureUpload } = require("../../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../../utils/multerErrors");

const userController = require("../../controllers/users/user.controllers");

router.get("/", authenticate, userController.getUsers);
router.get("/:id", authenticate, isBlocked, userController.getUser);

// Update user picture
router.put(
	"/update-picture/:id",
	authenticate,
	authorize,
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
	authenticate,
	authorize,
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

router.delete("/:id", authenticate, authorize, userController.deleteOneUser);

// forgot passsword routes
router.post(
	"/forgot-password/reset-code/:id",
	userController.sendPasswordResetCode
);
router.put("/forgot-password/:id", userController.updateForgotPassword); // If the reset code is verified, then update the password

router.patch("/block/:id", authenticate, authorize, userController.blockAnUser);
router.patch(
	"/unblock/:id",
	authenticate,
	authorize,
	userController.unblockAnUser
);

router.get("/follow/:id", authenticate, userController.getFollow);
router.get("/followers/:id", authenticate, userController.getFollowers);
router.patch("/follow/:id", authenticate, authorize, userController.follow);
router.patch("/unfollow/:id", authenticate, authorize, userController.unfollow);

module.exports = router;
