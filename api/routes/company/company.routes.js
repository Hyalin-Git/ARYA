const router = require("express").Router();
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const companyController = require("../../controllers/company/company.controller");
const { userPictureUpload } = require("../../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../../utils/multerErrors");

router.post(
	"/",
	authenticate,
	authorize,
	userPictureUpload.single("logo"),
	multerErrorsHandler,
	companyController.saveCompany
);

router.get("/:id", companyController.getCompany);

router.put(
	"/:id",
	userPictureUpload.single("logo"),
	multerErrorsHandler,
	companyController.updateCompany
);

router.delete("/:id", companyController.deleteCompany);

module.exports = router;
