const mongoose = require("mongoose");
const RoomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	number: {
		type: Number,
		required: true,
	},
}, { versionKey: false });

const Room = mongoose.model("Room", RoomSchema);
module.exports = { Room };
