const { validateToken } = require("../services/user");

function verifyToken(req, res, next) {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token)
		return res.status(401).json({ success: false, error: "Invalid token" });

	try {
		const decoded = validateToken(token);
		req.userId = decoded.userId;
		req.roomId = decoded.roomId;
		next();
	} catch (error) {
		res.status(401).json({ success: false, error: "Invalid token" });
	}
}

module.exports = verifyToken;