const bcrypt = require("bcrypt");
const { Room } = require("../models/room");

const createRoom = async (name, password) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	const room = await Room.create({
		name,
		password: hashedPassword,
		number: generateRoomNumber(),
	});

	return parseRoomForClient(room);
};

const deleteRoom = async (roomId) => {
	await Room.findByIdAndDelete(roomId);
};

const generateRoomNumber = () => Math.random().toString().slice(2, 8);

const parseRoomForClient = (room) => {
	if (!room) return null;
	const roomToReturn = { ...room.toObject() };
	delete roomToReturn.password;
	return roomToReturn;
};

const getRoomById = async (roomId) => {
	let room = null;
	try {
		room = await Room.findById(roomId);
	} catch (error) {
		console.log(`can't find room with id: ${roomId}`);
	}

	return parseRoomForClient(room);
};

const getRoomByNumber = async (roomNumber) => {
	const room = await Room.findOne({ number: roomNumber * 1 });

	return room;
};

const checkRoomPassword = async (room, roomPassword) => {
	return bcrypt.compare(roomPassword, room.password);
};

module.exports = {
	createRoom,
	deleteRoom,
	getRoomById,
	getRoomByNumber,
	checkRoomPassword,
};
