const express = require("express");
const { createRoom, getRoomById, getRoomByNumber, checkRoomPassword } = require("../services/room");
const { createUser, generateJWT } = require("../services/user");
const roomRouter = express.Router();

roomRouter.post("/create", async (req, res) => {
	const { roomName, roomPassword, userName } = req.body;
	const createdRoom = await createRoom(roomName, roomPassword);
	const createdUser = await createUser(userName, createdRoom._id);
	const token = generateJWT(createdRoom._id, createdUser._id)

	res.json({
		success: true,
		data: {
			room: createdRoom,
			user: createdUser,
			token,
		}
	});
});

roomRouter.post("/join", async (req, res) => {
	const { roomNumber, roomPassword, userName } = req.body;
	const room = await getRoomByNumber(roomNumber);
	if (!room) {
		return res.status(401).json({
			success: false,
			error: 'Invalid credentials (1)'
		});
	}
	const passwordIsCorrect = await checkRoomPassword(room, roomPassword);
	if (!passwordIsCorrect) {
		return res.status(401).json({
			success: false,
			error: 'Invalid credentials (2)'
		});
	}

	const createdUser = await createUser(userName, room._id);
	
	const token = generateJWT(room._id, createdUser._id)

	res.json({
		success: true,
		data: {
			room,
			user: createdUser,
			token,
		}
	});
});

roomRouter.get("/", async (req, res) => {
	const requestedRoomId = req.query.roomId;
	const requestedRoom = await getRoomById(requestedRoomId);

	res.json({
		room: requestedRoom
	})
});

module.exports = roomRouter;
