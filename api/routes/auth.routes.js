const router = require("express").Router();
const authController = require("../controllers/auth.controllers");
const { authenticate } = require("../middlewares/jwt.middleware");

// auth routes
router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);
router.delete("/logout", authenticate, authController.logout);

// side auth routes
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password");

module.exports = router;
