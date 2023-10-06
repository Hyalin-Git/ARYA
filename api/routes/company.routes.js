const router = require("express").Router();
const companyController = require("../controllers/company.controller");
const upload = require("../middlewares/multer.middleware");

router.post("/:id", upload.single("logo"), companyController.saveCompany);

router.get("/:id", companyController.getCompany);

router.put("/:id", upload.single("logo"), companyController.updateCompany);

router.delete("/:id", companyController.deleteCompany);

module.exports = router;
