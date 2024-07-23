const router = require("express").Router();
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const { canSendMessage } = require("../../middlewares/chats.middlewares");
const messageController = require("../../controllers/chats/message.controllers");
const { messageUpload } = require("../../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../../utils/multerErrors");

router.post(
	"/",
	authenticate,
	authorize,
	messageUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	// canSendMessage,
	messageController.saveMessage
);

router.get("/", authenticate, messageController.getMessages);
router.get("/:id", authenticate, messageController.getMessage);

router.put(
	"/:id",
	authenticate,
	authorize,
	messageUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	messageController.editMessage
);

router.delete("/:id", authenticate, authorize, messageController.deleteMessage);

router.patch(
	"/add-read/:id",
	authenticate,
	authorize,
	messageController.addToRead
);

router.patch(
	"/add-react/:id",
	authenticate,
	authorize,
	messageController.addReaction
);
router.patch(
	"/delete-react/:id",
	authenticate,
	authorize,
	messageController.deleteReaction
);

module.exports = router;
