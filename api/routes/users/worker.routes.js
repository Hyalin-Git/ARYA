const router = require("express").Router();
const workerController = require("../../controllers/users/worker.controller");

router.post("/:id", workerController.saveWorker);

router.get("/:id", workerController.getWorker);

router.put("/:id", workerController.updateWorker);

router.delete("/:id", workerController.deleteWorker);

module.exports = router;
