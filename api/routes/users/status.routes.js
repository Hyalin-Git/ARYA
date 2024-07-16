const router = require("express").Router();
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const statusController = require("../../controllers/users/status.controllers");

router.get("/", authenticate, authorize, statusController.getStatus);

module.exports = router;
