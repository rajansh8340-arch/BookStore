import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
	const token = req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		console.log("No token found");
		return res.status(401).json({ message: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.id };
		next();
	} catch (err) {
		console.error("Token verification error:", err);
		res.status(401).json({ message: "Token is not valid" });
	}
};

export default authMiddleware;
