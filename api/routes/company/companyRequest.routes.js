const router = require("express").Router();
const {
	authenticate,
	authorize,
} = require("../../middlewares/jwt.middleware.js");
const companyRequestController = require("../../controllers/company/companyRequest.controller.js");

// Companies

router.get(
	"/company",
	authenticate,
	authorize,
	companyRequestController.getCompanyRequests
);

router.get(
	"/company/:id",
	authenticate,
	authorize,
	companyRequestController.getCompanyRequest
);

router.patch(
	"/progress/:id",
	authenticate,
	authorize,
	companyRequestController.progressCompanyRequest
);

router.patch(
	"/accept/:id",
	authenticate,
	authorize,
	companyRequestController.acceptCompanyRequest
);

router.patch(
	"/decline/:id",
	authenticate,
	authorize,
	companyRequestController.declineCompanyRequest
);
// Users
router.post(
	"/",
	authenticate,
	authorize,
	companyRequestController.saveCompanyRequest
);

router.get(
	"/user",
	authenticate,
	authorize,
	companyRequestController.getUserCompanyRequests
);

router.get(
	"/user/:id",
	authenticate,
	authorize,
	companyRequestController.getUserCompanyRequest
);

router.put(
	"/:id",
	authenticate,
	authorize,
	companyRequestController.updateCompanyRequest
);

router.delete(
	"/:id",
	authenticate,
	authorize,
	companyRequestController.deleteCompanyRequest
);

module.exports = router;
