const { validateToken } = require("../services/user");

function verifyToken(req, res, next) {
	const token = req.headers.authorization?.split(" ")[1];
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

function verfiyWebSocket(socket, next) {
	if (socket.handshake.query && socket.handshake.query.jwt) {
		const decoded = validateToken(socket.handshake.query.jwt);
		if (!decoded) return next(new Error("Auth error from WS"));

		socket.decoded = decoded;
		next();
	} else {
		next(new Error("Auth error from WS"));
	}
}

module.exports = { verifyToken, verfiyWebSocket };
