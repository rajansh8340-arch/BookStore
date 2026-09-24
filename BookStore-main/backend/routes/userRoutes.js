import express from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
	try {
		let { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ message: "Please provide all required fields: name, email, and password." });
		}

		name = name.trim();
		email = email.trim().toLowerCase();

		if (password.length < 4) {
			return res
				.status(400)
				.json({ message: "Password must be at least 4 characters long." });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "An account with this email already exists." });
		}

		const salt = await bcrypt.genSalt(10);
		const pwHash = await bcrypt.hash(password, salt);

		const newUser = new User({ name, email, password: pwHash });
		const savedUser = await newUser.save();

		const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
			expiresIn: "7d",
		});

		const { password: userPassword, ...userWithoutPassword } = savedUser._doc;
		return res.status(201).json({
			message: "User registered successfully",
			user: userWithoutPassword,
			token,
		});
	} catch (error) {
		console.error("Signup error:", error.message);
		return res.status(500).json({ message: error.message || "Registration failed" });
	}
});

router.post("/login", async (req, res) => {
	try {
		let { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Please provide both email and password." });
		}

		email = email.trim().toLowerCase();

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const token = jwt.sign({ id: user._id }, JWT_SECRET, {
			expiresIn: "7d",
		});

		const { password: userPassword, ...userWithoutPassword } = user._doc;
		return res.status(200).json({
			message: "Login successful",
			user: userWithoutPassword,
			token,
		});
	} catch (error) {
		console.error("Login error:", error.message);
		return res.status(500).json({ message: error.message || "Login failed" });
	}
});

export default router;

