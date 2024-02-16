const router = require("express").Router();
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");
const {
	checkRole,
	isLeader,
} = require("../../middlewares/company.middelwares");
const companyController = require("../../controllers/company/company.controller");
const { userPictureUpload } = require("../../middlewares/multer.middleware");
const { multerErrorsHandler } = require("../../utils/multerErrors");

router.post(
	"/",
	authenticate,
	authorize,
	userPictureUpload.fields([{ name: "logo", maxCount: 1 }]),
	multerErrorsHandler,
	companyController.saveCompany
);

router.get("/:id", companyController.getCompany);

router.put(
	"/:id",
	authenticate,
	authorize,
	userPictureUpload.single("logo"),
	multerErrorsHandler,
	companyController.updateCompany
);

router.delete("/:id", authenticate, authorize, companyController.deleteCompany);

router.patch(
	"/patch-role/:id",
	authenticate,
	authorize,
	companyController.patchRole
);

router.patch(
	"/remove-member/:id",
	authenticate,
	authorize,
	companyController.removeMember
);

module.exports = router;
