import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const authMiddleware = (req, res, next) => {
	const authHeader = req.header("Authorization");
	const token = authHeader?.startsWith("Bearer ")
		? authHeader.slice(7).trim()
		: authHeader;

	if (!token) {
		return res.status(401).json({ message: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = { id: decoded.id };
		next();
	} catch (err) {
		console.error("Token verification error:", err.message);
		return res.status(401).json({ message: "Token is not valid or expired" });
	}
};

export default authMiddleware;

