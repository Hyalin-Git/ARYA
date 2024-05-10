const router = require("express").Router();
const {
	authenticate,
	authorize,
	isBlocked,
	isAdmin,
} = require("../../middlewares/jwt.middleware");
const reportController = require("../../controllers/posts/reportPost.controller");

router.post("/", authenticate, authorize, reportController.saveReport);

router.get("/", reportController.getReports);
router.get("/:id", reportController.getReport);

router.put("/:id", authenticate, isAdmin, reportController.updateReport);

router.delete("/:id");

module.exports = router;
