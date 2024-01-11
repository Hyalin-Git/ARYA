const router = require("express").Router();
const {
	authenticate,
	authorize,
} = require("../../middlewares/jwt.middleware.js");
const companyRequestController = require("../../controllers/company/companyRequest.controller.js");

router.post(
	"/",
	authenticate,
	authorize,
	companyRequestController.saveCompanyRequest
);

router.get("/");
router.get("/:id");

router.put("/:id");

router.delete("/:id");

module.exports = router;
