const router = require("express").Router();
const conversationController = require("../controllers/chat/conversation.controllers");

router.post("/", conversationController.accessOrCreateConversation);
router.get("/", conversationController.getConversations);

module.exports = router;
