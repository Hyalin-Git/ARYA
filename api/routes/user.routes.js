const router = require("express").Router();
const { authorization } = require("../middlewares/jwt.middleware");
const userController = require("../controllers/user.controllers");

router.get("/", authorization, userController.getUsers);
router.get("/:id", authorization, userController.getUser);
router.delete("/:id", authorization, userController.deleteOneUser);

// send verification mail route
router.get("/send-verification-mail/:id", userController.checkUserVerification);

module.exports = router;
