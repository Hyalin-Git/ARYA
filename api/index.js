require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const crypto = require("crypto");
const moment = require("moment");
require("./config/db");

// routes
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
// secure Express apps by setting HTTP response headers
app.use(helmet());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
// app.use("api/messages");

// const date = moment();
// const newDate = date.add(1, "minutes");
// const formattedDate = newDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
// const actualDate = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

// let jwtSecretKey = crypto.randomBytes(32).toString("hex");
// console.log(jwtSecretKey);
// async function checkJwtStatus() {
// 	JwtKeyModel.find()
// 		.then((jwt) => {
// 			if (jwt.length === 0) {
// 				jwtSecretKey = crypto.randomBytes(32).toString("hex");
// 				const jwtModel = new JwtKeyModel({
// 					secretKey: jwtSecretKey,
// 					status: "Active",
// 					expiresAt: formattedDate,
// 				});
// 				jwtModel
// 					.save()
// 					.then((data) => {
// 						console.log(data);
// 					})
// 					.catch((err) => {
// 						console.log(err);
// 					});
// 			} else {
// 				// If the actual date is < than the expiresAt then return true
// 				console.log(moment(actualDate).isBefore(moment(jwt[0].expiresAt)));
// 				if (
// 					moment(actualDate).isBefore(moment(jwt[0].expiresAt)) &&
// 					jwt.length <= 1
// 				) {
// 					jwtSecretKey = crypto.randomBytes(32).toString("hex");
// 					const jwtModel = new JwtKeyModel({
// 						secretKey: jwtSecretKey,
// 						status: "Active",
// 						expiresAt: formattedDate,
// 					});
// 					jwtModel
// 						.save()
// 						.then((data) => {
// 							JwtKeyModel.findByIdAndUpdate(
// 								{ _id: jwt[0]._id },
// 								{
// 									$set: {
// 										status: "Expired",
// 									},
// 								}
// 							)
// 								.then(() => {
// 									console.log("jwt status updated");
// 								})
// 								.catch((err) => console.log(err));
// 						})
// 						.catch((err) => {
// 							console.log(err);
// 						});
// 				}
// 			}
// 			jwt.map((token) => {
// 				if (token.status === "Expired") {
// 					setTimeout(() => {
// 						JwtKeyModel.findOneAndDelete()
// 							.then((deleted) => console.log(deleted))
// 							.catch((err) => console.log(err));
// 					}, 1 * 60 * 1000);
// 				}
// 			});
// 		})
// 		.catch((err) => console.log(err));
// }
// checkJwtStatus();
// // 24 * 60 * 60 * 1000
// const interval = 2 * 60 * 1000;
// setInterval(checkJwtStatus, interval);

app.listen(process.env.PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`server is listening on port ${process.env.PORT}`);
	}
});
