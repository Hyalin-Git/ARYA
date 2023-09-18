const router = require("express").Router();
const { authenticate, isAdmin } = require("../middlewares/jwt.middleware");
const userController = require("../controllers/user.controllers");
const upload = require("../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../utils/multerErrors");

router.get("/", authenticate, isAdmin, userController.getUsers);
router.get("/:id", authenticate, isAdmin, userController.getUser);

router.put(
	"/:id/update-picture",
	upload.single("picture"),
	authenticate,
	isAdmin,
	multerErrorsHandler,
	userController.updateUserPicture
);

router.put(
	"/:id/update-user",
	authenticate,
	isAdmin,
	userController.updateUser
);

router.delete("/:id", authenticate, isAdmin, userController.deleteOneUser);

module.exports = router;
