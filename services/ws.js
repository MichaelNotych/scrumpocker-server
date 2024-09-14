const { getRoomById, deleteRoom } = require("./room");
const { getUser, getRoomUsers, deleteUser } = require("./user");
const {
	getAllRoomVotes,
	getUserVoteInRoom,
	createVote,
	updateVote,
	getRoomMedian,
	deleteAllRoomVotes,
} = require("./vote");

const webSocketHandler = (io, socket) => {
	socket.on("join", async ({ roomId }) => {
		const room = await getRoomById(roomId);
		const user = await getUser(socket.decoded.userId);
		console.log(`${user.name} login to room ${room.name}`);
		socket.join(roomId);

		// refresh users count to all users
		io.to(roomId).emit("updateUserCount", {
			data: {
				users: await getRoomUsers(roomId),
			},
		});

		// update votes
		io.to(roomId).emit("updateVotes", {
			data: {
				votes: await getAllRoomVotes(roomId),
			},
		});
	});

	socket.on("vote", async ({ roomId, userId, voteValue }) => {
		const existedVote = await getUserVoteInRoom(userId, roomId);
		if (!existedVote) {
			await createVote(voteValue, roomId, userId);
		} else {
			await updateVote(existedVote._id, voteValue);
		}

		// update votes
		io.to(roomId).emit("updateVotes", {
			data: {
				votes: await getAllRoomVotes(roomId),
			},
		});
	});

	socket.on("showResults", async ({ roomId }) => {
		// send event to all users
		io.to(roomId).emit("showResults", {
			data: {
				median: await getRoomMedian(roomId),
			},
		});
	});

	socket.on("reset", async ({ roomId }) => {
		await deleteAllRoomVotes(roomId);

		io.to(roomId).emit("reset");
	});

	socket.on("leftRoom", async ({ roomId, userId }) => {
		await deleteUser(userId);

		const usersLeft = await getRoomUsers(roomId);

		// if there is no participants, delete room and all its votes
		if (usersLeft.length === 0) {
			deleteAllRoomVotes(roomId);
			deleteRoom(roomId);
			return;
		}

		// refresh users count to all users
		io.to(roomId).emit("updateUserCount", {
			data: {
				users: await getRoomUsers(roomId),
			},
		});
	});

	// socket.on("join", ({ room, username }) => {
	// 	socket.join(room);

	// 	const { isExist, user } = addUser({ name: username, room });

	// 	socket.emit("message", {
	// 		data: {
	// 			user: {
	// 				name: "admin",
	// 			},
	// 			message: `Hey ${username}`,
	// 		},
	// 	});

	// 	socket.broadcast.to(user.room).emit("message", {
	// 		data: {
	// 			user: {
	// 				name: "admin",
	// 			},
	// 			message: `${username} has joined`,
	// 		},
	// 	});

	io.on("disconnect", () => {
		console.log("socket disconnected");
	});
};

module.exports = { webSocketHandler };
