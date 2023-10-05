require("dotenv").config({ path: "./config/.env" });
const https = require("https");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const fs = require("fs");
const cors = require("cors");
require("./config/db.config");
require("./utils/cronJob");

// routes
const adminRouter = require("./routes/admin.routes");
const authRouter = require("./routes/auth.routes");
const twitterRouter = require("./routes/twitter.routes");
const facebookRouter = require("./routes/facebook.routes");
const userRouter = require("./routes/user.routes");
const workerRouter = require("./routes/worker.routes");
const postRouter = require("./routes/post.routes");
const verificationRouter = require("./routes/verification.routes");
const { authenticate } = require("./middlewares/jwt.middleware");

const app = express();

const privateKey = fs.readFileSync("./config/localhost-key.pem", "utf8");
const certificate = fs.readFileSync("./config/localhost.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

const corsOptions = {
	origin: `*`,
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

app.use("/api/admin", adminRouter);

app.use("/api/auth", authRouter);
app.use("/api/twitter/auth", twitterRouter);
app.use("/api/facebook/auth", facebookRouter);
app.use("/api/users", userRouter);
app.use("/api/worker", workerRouter);
app.use("/api/post", postRouter);
app.use("/api/verification", verificationRouter);

app.get("/login/success", authenticate, (req, res, next) => {
	if (req.headers?.authorization?.split(" ")[1]) {
		res.status(200).send({
			error: false,
			message: "Successfully Loged in",
			userId: res.locals.user.id,
		});
	}
});

httpsServer.listen(process.env.PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`server is listening on port ${process.env.PORT}`);
	}
});
