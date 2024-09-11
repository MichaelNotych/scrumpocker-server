const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	room: {
		type: String,
		required: true,
	}
}, { versionKey: false });

const User = mongoose.model("User", UserSchema);
module.exports = { User };
