const router = require("express").Router();
const workerController = require("../controllers/worker.controller");

router.post("/:id", workerController.saveWorker);

module.exports = router;
