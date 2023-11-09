const router = require("express").Router();
const conversationController = require("../../controllers/chat/conversation.controllers");

router.post("/", conversationController.accessOrCreateConversation);
router.get("/", conversationController.getConversations);
router.get("/:id", conversationController.getConversation);
router.put("/:id", conversationController.editConversation)
router.delete("/:id", conversationController.deleteConversation);

module.exports = router;
