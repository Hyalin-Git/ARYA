const router = require("express").Router();
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const followRequestController = require("../../controllers/users/followRequest.controllers");

router.get(
	"/",
	authenticate,
	authorize,
	followRequestController.getFollowRequests
);

router.patch(
	"/accept/:id",
	authenticate,
	authorize,
	followRequestController.acceptFollowRequest
);

router.delete(
	"/decline/:id",
	authenticate,
	authorize,
	followRequestController.declineFollowRequest
);

module.exports = router;
