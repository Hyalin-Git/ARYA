const router = require("express").Router();
const authController = require("../controllers/auth.controllers");
const { authorization } = require("../middlewares/jwt.middleware");

// auth routes
router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);
router.delete("/logout", authorization, authController.logout);

// side auth routes

// Takes userId and token as parameters
router.get("/:id/verify/:token", authController.verifyLink);

router.post("/refresh-token", authController.refreshToken);

router.post("/forgot-password");

module.exports = router;
