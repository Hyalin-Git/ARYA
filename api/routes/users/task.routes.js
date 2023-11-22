const router = require("express").Router();
const taskController = require("../../controllers/users/task.controllers");
const { authenticate, authorize } = require("../../middlewares/jwt.middleware");

router.post("/", taskController.addTask);

router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTask);

router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
