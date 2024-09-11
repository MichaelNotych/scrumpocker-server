const { Vote } = require("../models/vote");

const createVote = async (value, roomId, userId) => {
	const vote = await Vote.create({
		value,
		roomId,
		userId
	});

	return vote;
};

const updateVote = async (voteId, newValue) => {
	const vote = await Vote.findById(voteId)
	vote.value = newValue;
	await vote.save()

	return vote;
};

const getAllRoomVotes = async (roomId) => {
	return Vote.find({
		roomId
	});
};

const deleteAllRoomVotes = async (roomId) => {
	await Vote.deleteMany({
		roomId
	});
}

const getUserVoteInRoom = async (userId, roomId) => {
	return Vote.findOne({
		roomId,
		userId
	});
}

const getRoomMedian = async (roomId) => {
	const allVotes = await getAllRoomVotes(roomId);
	const sortedVotes = allVotes.sort((a, b) => a.value - b.value)
	let median;
	if (sortedVotes.length % 2 === 1) {
		median = sortedVotes[Math.floor(sortedVotes.length / 2)].value;
	} else {
		median = ((sortedVotes[sortedVotes.length / 2].value + sortedVotes[sortedVotes.length / 2 - 1].value) / 2).toFixed(1) * 1
	}

	return median;
}

module.exports = { createVote, getAllRoomVotes, updateVote, getUserVoteInRoom, getRoomMedian, deleteAllRoomVotes };
