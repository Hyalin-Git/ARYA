const router = require("express").Router();
const authController = require("../controllers/auth.controllers");
const { authorization } = require("../middlewares/jwt.middleware");

// auth routes
router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);
router.delete("/logout", authorization, authController.logout);

// side auth routes
router.post("/refresh-token", authController.refreshToken);

router.post("/forgot-password");

module.exports = router;
