const router = require("express").Router();
const {
	authenticate,
	authorize,
	isBlocked,
	isAdmin,
} = require("../../middlewares/jwt.middleware");
const reportController = require("../../controllers/users/report.controllers");

router.post("/", reportController.saveReport);

router.get("/", reportController.getReports);
router.get("/:id", reportController.getReport);

router.put("/:id", authenticate, isAdmin, reportController.updateReport);

router.delete("/:id");

module.exports = router;
