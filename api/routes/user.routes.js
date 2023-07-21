const router = require("express").Router();
const { authorization } = require("../middlewares/jwt.middleware");
const userController = require("../controllers/user.controllers");

router.get("/", authorization, userController.getUsers);
router.get("/:id", authorization, userController.getUser);
router.delete("/:id", authorization, userController.deleteOneUser);

// If the user want to update his password
router.put(
	"/:id/password-reset",

	userController.updateUserPassword
);
// Send the reset code to the user email
router.post("/forgot-password", userController.sendResetCode);
// If the reset code is verified, then update the password
router.put("/forgot-password", userController.updateForgotPassword);

module.exports = router;
