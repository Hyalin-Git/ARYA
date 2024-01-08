const router = require("express").Router();
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const {
	canAccessConversation,
} = require("../../middlewares/chats.middlewares");
const conversationController = require("../../controllers/chats/conversation.controllers");

router.post("/", conversationController.accessOrCreateConversation);
router.get(
	"/",
	authenticate,
	authorize,
	conversationController.getConversations
);
router.get(
	"/:id",
	authenticate,
	authorize,
	canAccessConversation,
	conversationController.getConversation
);
router.put("/:id", conversationController.editConversation);
router.delete("/:id", conversationController.deleteConversation);

module.exports = router;
