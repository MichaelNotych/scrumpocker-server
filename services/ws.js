const { getRoomById } = require("./room");
const { getUser, getRoomUsers, validateToken } = require("./user");
const { getAllRoomVotes, getUserVoteInRoom, createVote, updateVote, getRoomMedian, deleteAllRoomVotes } = require("./vote");

const webSocketHandler = (io, socket) => {
	socket.on('join', async ({roomId}) => {
		const room = await getRoomById(roomId)
		const user = await getUser(socket.decoded.userId);
		console.log(`${user.name} login to room ${room.name}`);
		socket.join(roomId);

		// refresh users count to all users
		io.to(roomId).emit('updateUserCount', {
			data: {
				users: await getRoomUsers(roomId)
			}
		})

		// update votes
		io.to(roomId).emit('updateVotes', {
			data: {
				votes: await getAllRoomVotes(roomId)
			}
		});
	});

	socket.on('vote', async ({roomId, userId, voteValue}) => {
		const existedVote = await getUserVoteInRoom(userId, roomId);
		console.log('existedVote', existedVote)
		if (!existedVote) {
			await createVote(voteValue, roomId, userId);
		} else {
			await updateVote(existedVote._id, voteValue);
		}

		// update votes
		io.to(roomId).emit('updateVotes', {
			data: {
				votes: await getAllRoomVotes(roomId)
			}
		});
	});

	socket.on('showResults', async ({roomId}) => {
		// send event to all users
		io.to(roomId).emit('showResults', {
			data: {
				median: await getRoomMedian(roomId),
			}
		});
	});

	socket.on('reset', async ({roomId}) => {
		await deleteAllRoomVotes(roomId)

		io.to(roomId).emit('reset')
	})

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

const webSocketMiddleWare = (socket, next) => {
	if (socket.handshake.query && socket.handshake.query.jwt) {
		const decoded = validateToken(socket.handshake.query.jwt);
		console.log('decoded', decoded)
		if (!decoded) return next(new Error('Auth error from WS'));

		socket.decoded = decoded;
		next();
	} else {
		next(new Error('Auth error from WS'));
	}
}

module.exports = { webSocketHandler, webSocketMiddleWare };
