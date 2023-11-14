const router = require("express").Router();
const companyController = require("../controllers/company.controller");
const { userPictureUpload } = require("../middlewares/multer.middleware");

router.post(
	"/:id",
	userPictureUpload.single("logo"),
	companyController.saveCompany
);

router.get("/:id", companyController.getCompany);

router.put(
	"/:id",
	userPictureUpload.single("logo"),
	companyController.updateCompany
);

router.delete("/:id", companyController.deleteCompany);

module.exports = router;
