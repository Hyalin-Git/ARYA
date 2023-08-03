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

// Auth routes for Twitter

// router.get(
// 	"/twitter",
// 	twitterAuth.twitterAuth
// 	// passport.authorize("twitter", {
// 	// 	scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
// 	// })
// );
// router.get("/twitter/callback", function (req, res, next) {
// 	const code = req.query.code;
// 	console.log(code);
// 	return axios({
// 		method: "POST",
// 		url: "https://api.twitter.com/2/oauth2/token",
// 		withCredentials: true,
// 		headers: {
// 			"Content-Type": "application/x-www-form-urlencoded",
// 		},
// 		data: {
// 			code: code,
// 			grant_type: "authorization_code",
// 			client_id: `${process.env.TWITTER_CLIENT_ID}`,
// 			code_verifier: "challenge",
// 			redirect_uri: "http://localhost:5000/api/auth/twitter/callback",
// 		},
// 	})
// 		.then((success) => {
// 			if (success) {
// 				console.log(success);
// 			}
// 		})
// 		.catch((err) => console.log(err));
// });

module.exports = router;
