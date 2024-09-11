require('dotenv').config();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const createUser = async (name, roomId) => {
	const user = await User.create({
		name,
		room: roomId,
	});

	return user;
};

const getRoomUsers = async (roomId) => {
	return User.find({room: roomId})
};

const getUser = async (userId) => {
	return User.findById(userId)
}

const generateJWT = (roomId, userId) => {
	return jwt.sign(
		{
			roomId,
			userId,
		},
		process.env.JWT_SECRET, {
			expiresIn: '1h'
		}
	);
};

const validateToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { createUser, getRoomUsers, getUser, generateJWT, validateToken };
