const router = require("express").Router();
const messageController = require("../../controllers/chat/message.controllers");

router.post("/", messageController.saveMessage);
// Usefull to fetch all data of the message data such as the send time
router.get("/:id", messageController.getMessage);

router.put("/:id", messageController.editMessage);

router.delete("/:id", messageController.deleteMessage);

router.patch("/add-react/:id", messageController.addReaction);
router.patch("/delete-react/:id", messageController.deleteReaction);

module.exports = router;
