const router = require("express").Router();
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const {
	canSendMessage,
} = require("../../middlewares/checkIfBlocked.middleware");
const messageController = require("../../controllers/chats/message.controllers");
const { messageUpload } = require("../../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../../utils/multerErrors");

router.post(
	"/",
	authenticate,
	authorize,
	messageUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	canSendMessage,
	messageController.saveMessage
);
// Usefull to fetch all data of the message data such as the send time
router.get("/:id", messageController.getMessage);

router.put(
	"/:id",
	messageUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
	messageController.editMessage
);

router.delete("/:id", messageController.deleteMessage);

router.patch("/add-react/:id", messageController.addReaction);
router.patch("/delete-react/:id", messageController.deleteReaction);

module.exports = router;
