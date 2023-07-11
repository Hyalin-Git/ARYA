const router = require("express").Router();
const { authorization } = require("../middlewares/jwt.middleware");
const { randomSecret } = require("../middlewares/jwt.middleware");
const userController = require("../controllers/user.controllers");

router.get("/:id", randomSecret, authorization, userController.getUser);

module.exports = router;
