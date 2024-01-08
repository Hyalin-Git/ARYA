const router = require("express").Router();
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const messageRequestController = require("../../controllers/chats/messageRequest.controllers");

router.get(
	"/",
	authenticate,
	authorize,
	messageRequestController.getMessageRequests
);

router.post(
	"/:id/accept",
	authenticate,
	authorize,
	messageRequestController.acceptMessageRequests
);

router.delete(
	"/:id/decline",
	authenticate,
	authorize,
	messageRequestController.declineMessageRequests
);

module.exports = router;
