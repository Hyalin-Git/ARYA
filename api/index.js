require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const crypto = require("crypto");
const moment = require("moment");
const multer = require("multer");
const upload = require("./middlewares/multer.middleware");
const cors = require("cors");
require("./config/db");
require("node:http");
require("./utils/cronJob");

// routes
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const verificationRouter = require("./routes/verification.routes");
const { authorization } = require("./middlewares/jwt.middleware");

const app = express();

const corsOptions = {
	origin: `${process.env.CLIENT_URL}`,
	credentials: true,
	allowedHeaders: ["sessionId", "Content-Type"],
	exposedHeaders: ["sessionId"],
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// secure Express apps by setting HTTP response headers
app.use(helmet());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/post", postRouter);
app.use("/api/verification", verificationRouter);

app.get("/login/success", authorization, (req, res, next) => {
	if (req.headers?.authorization?.split(" ")[1]) {
		res.status(200).send({
			error: false,
			message: "Successfully Loged in",
			userId: res.locals.user.id,
		});
	}
});

app.listen(process.env.PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`server is listening on port ${process.env.PORT}`);
	}
});
