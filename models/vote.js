const mongoose = require("mongoose");
const VoteSchema = new mongoose.Schema({
	value: {
		type: Number,
		required: true,
	},
	roomId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	}
}, { versionKey: false });

const Vote = mongoose.model("Vote", VoteSchema);
module.exports = { Vote };