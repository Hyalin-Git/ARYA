const router = require("express").Router();
const commentController = require("../controllers/comment.controller");
const upload = require("../middlewares/multer.middleware");

const { multerErrorsHandler } = require("../utils/multerErrors");

// CRUD
router.get("/", commentController.getComments);
router.get("/:id", commentController.getComment);

router.post("/", commentController.addComment);

router.put("/:id", commentController.editComment);

router.delete("/:id", commentController.deleteComment);

// React to a comment
router.patch("/add-react/:id", commentController.addReaction);
router.patch("/delete-react/:id", commentController.deleteReaction);

module.exports = router;
