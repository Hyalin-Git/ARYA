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
const adminRouter = require("./routes/users/admin.routes");
const authRouter = require("./routes/users/auth.routes");

const userRouter = require("./routes/users/user.routes");
const companyRouter = require("./routes/users/company.routes");
const workerRouter = require("./routes/users/worker.routes");
const postRouter = require("./routes/posts/post.routes");
const commentRouter = require("./routes/posts/comment.routes");
const conversationRouter = require("./routes/chats/conversation.routes");
const messageRouter = require("./routes/chats/message.routes");
const verificationRouter = require("./routes/verifications/verification.routes");
const { authenticate } = require("./middlewares/jwt.middleware");

const twitterRouter = require("./routes/twitter.routes");
const facebookRouter = require("./routes/facebook.routes");

const app = express();

const privateKey = fs.readFileSync("./config/localhost-key.pem", "utf8");
const certificate = fs.readFileSync("./config/localhost.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

const corsOptions = {
	origin: `http://192.168.0.32:3000`,
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
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/company", companyRouter);
app.use("/api/worker", workerRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
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

const server = httpsServer.listen(process.env.PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`server is listening on port ${process.env.PORT}`);
	}
});

const io = require("socket.io")(server, {
	pingTimeout: 60000,
	cors: {
		origin: "http://localhost:3000",
	},
});

io.on("connection", () => {
	console.log("connected to socket");
});
