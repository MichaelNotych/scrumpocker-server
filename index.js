const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const http = require("http");
const roomRouter = require("./routes/room");
const userRouter = require("./routes/user");
const verifyToken = require("./middleware/auth");
require('dotenv').config() 
const { Server } = require("socket.io");
const { webSocketMiddleWare } = require("./services/ws");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use('/room', roomRouter);
app.use('/user', verifyToken, userRouter);

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

// check jwt on connection
io.use(webSocketMiddleWare)

io.on("connection", (socket) => webSocketHandler(io, socket));

const start = async () => {
	try {
		// connect to db
		await mongoose.connect(process.env.MONGO_DB_URL)

		// start listening the server
		server.listen(process.env.PORT, () => {
			console.log("Server is running");
		});
		
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

start();
