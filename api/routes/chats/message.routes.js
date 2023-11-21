const router = require("express").Router();
const messageController = require("../../controllers/chats/message.controllers");
const { messageUpload } = require("../../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../../utils/multerErrors");

router.post(
	"/",
	messageUpload.fields([{ name: "media", maxCount: 4 }]),
	multerErrorsHandler,
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
