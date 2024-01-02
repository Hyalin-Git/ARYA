const router = require("express").Router();
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const {
	canAccessPosts,
} = require("../../middlewares/checkIfBlocked.middleware");
const { postUpload } = require("../../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../../utils/multerErrors");
const repostController = require("../../controllers/posts/repost.controller");

router.post(
	"/",
	authenticate,
	authorize,
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	repostController.saveRepost
);
router.get("/", authenticate, repostController.getReposts);
router.get("/:id", repostController.getRepost);

router.put(
	"/:id",
	authenticate,
	authorize,
	postUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	repostController.updateRepost
);
router.delete("/:id", authenticate, authorize, repostController.deleteRepost);

// React to a repost
router.patch(
	"/add-react/:id",
	authenticate,
	authorize,
	repostController.addReaction
);
router.patch(
	"/delete-react/:id",
	authenticate,
	authorize,
	repostController.deleteReaction
);

module.exports = router;
