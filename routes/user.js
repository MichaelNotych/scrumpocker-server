const express = require("express");
const { getUser } = require("../services/user");
const userRouter = express.Router();

userRouter.get("/me", async (req, res) => {
	const user = await getUser(req.userId);

	res.json({
		user,
	});
});
module.exports = userRouter;
