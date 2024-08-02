require("dotenv").config({ path: "./config/.env" });
const https = require("https");
const http = require("http");
const express = require("express");
const helmet = require("helmet");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("./config/db.config");
require("./utils/cronJob");

// routes
const adminRouter = require("./routes/users/admin.routes");
const authRouter = require("./routes/users/auth.routes");

// User related
const userRouter = require("./routes/users/user.routes");
const followRequestRouter = require("./routes/users/followRequest.routes");
const freelanceRouter = require("./routes/users/freelance.routes");
const taskRouter = require("./routes/users/task.routes");

const companyRouter = require("./routes/company/company.routes");
const companyRequestRouter = require("./routes/company/companyRequest.routes");

// Posts related
const feedRouter = require("./routes/posts/feed.routes");
const postRouter = require("./routes/posts/post.routes");
const repostRouter = require("./routes/posts/repost.routes");
const commentRouter = require("./routes/posts/comment.routes");
const answerRouter = require("./routes/posts/answer.routes");

// Conversations
const conversationRouter = require("./routes/chats/conversation.routes");
const messageRouter = require("./routes/chats/message.routes");
const messageRequestRouter = require("./routes/chats/messageRequest.routes");

const verificationRouter = require("./routes/verifications/verification.routes");

const reportUserRouter = require("./routes/users/reportUser.routes");
const reportPostRouter = require("./routes/posts/reportPost.routes");

const { authenticate } = require("./middlewares/jwt.middleware");

const twitterRouter = require("./routes/twitter.routes");
const facebookRouter = require("./routes/facebook.routes");
const UserModel = require("./models/users/User.model");

const app = express();

// const privateKey = fs.readFileSync("./config/localhost-key.pem", "utf8");
// const certificate = fs.readFileSync("./config/localhost.pem", "utf8");

// const credentials = { key: privateKey, cert: certificate };

// const httpsServer = https.createServer(credentials, app);

const corsOptions = {
	origin: `*`,
	credentials: true,
	allowedHeaders: ["sessionId", "Content-Type", "Authorization"],
	exposedHeaders: ["sessionId"],
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// secure Express apps by setting HTTP response headers
app.use(helmet());

app.use("/api/admin", adminRouter);

app.use("/api/auth", authRouter);
app.use("/api/twitter/auth", twitterRouter);
app.use("/api/facebook/auth", facebookRouter);

app.use("/api/users", userRouter);
app.use("/api/follow-requests", followRequestRouter);
app.use("/api/freelance", freelanceRouter);
app.use("/api/task", taskRouter);
app.use("/api/user/report", reportUserRouter);

app.use("/api/company", companyRouter);
app.use("/api/companyRequests", companyRequestRouter);

app.use("/api/feed", feedRouter);
app.use("/api/posts", postRouter);
app.use("/api/reposts", repostRouter);
app.use("/api/comments", commentRouter);
app.use("/api/answers", answerRouter);
app.use("/api/post/report", reportPostRouter);

app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/messages-requests", messageRequestRouter);

app.use("/api/verification", verificationRouter);

app.get("/login/success", authenticate, (req, res, next) => {
	if (req.headers?.authorization?.split(" ")[1]) {
		res.status(200).send({
			error: false,
			message: "Successfully Loged in",
			userId: res.locals.user.id,
			iat: res.locals.decodedToken.iat,
			exp: res.locals.decodedToken.exp,
		});
	}
});

const server = app.listen(process.env.PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`server is listening on port ${process.env.PORT}`);
	}
});

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		transports: ["websocket", "polling"],
		credentials: true,
	},
	allowEIO3: true,
});

io.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.once("logged-user", (userId) => {
		UserModel.findByIdAndUpdate(
			{ _id: userId },
			{
				$set: {
					status: {
						isConnected: true,
						socketId: socket.id,
					},
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		)
			.then((user) => {
				console.log(user);
				io.emit("logged-user");
			})
			.catch((err) => console.log(err));
	});
	socket.on("typing", (boolean, conversationId) => {
		socket.broadcast.emit("is-typing", boolean, conversationId);
	});
	socket.on("pending-message", async (content) => {
		const senderId = await UserModel.findById({ _id: content.senderId });

		io.to(senderId.status.socketId).emit("pending-message", content);
	});
	socket.on("private-message", async (content, receiver) => {
		const senderId = await UserModel.findById({ _id: content.senderId });
		const receiverId = await UserModel.findById({ _id: receiver });

		io.to(receiverId.status.socketId)
			.to(senderId.status.socketId)
			.emit("receive-message", content);
	});
	socket.on("latest-message", (message) => {
		io.emit("latest-message", message);
	});
	socket.on("update-message", async (content, receiver) => {
		const senderId = await UserModel.findById({ _id: content.senderId });
		const receiverId = await UserModel.findById({ _id: receiver });

		io.to(receiverId.status.socketId)
			.to(senderId.status.socketId)
			.emit("updated-message", content);
	});
	socket.on("delete-message", async (content, receiver) => {
		const senderId = await UserModel.findById({ _id: content.senderId });
		const receiverId = await UserModel.findById({ _id: receiver });

		io.to(receiverId.status.socketId)
			.to(senderId.status.socketId)
			.emit("deleted-message", content);
	});
	socket.once("disconnect", () => {
		console.log("🔥: A user disconnected");
		UserModel.findOneAndUpdate(
			{ "status.socketId": socket.id },
			{
				$set: {
					status: {
						isConnected: false,
						socketId: null,
					},
				},
			},
			{
				new: true,
				setDefaultsOnInsert: true,
			}
		).then((user) => {
			console.log(user);
			io.emit("disconnected-user");
		});
	});
});
