import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { JWT_SECRET } from "../config.js";
import { memoryUsers, isMongooseConnected } from "../dataStore.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
	try {
		let { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				message: "Please provide all required fields: name, email, and password.",
			});
		}

		name = name.trim();
		email = email.trim().toLowerCase();

		if (password.length < 4) {
			return res.status(400).json({
				message: "Password must be at least 4 characters long.",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const pwHash = await bcrypt.hash(password, salt);

		// If MongoDB is connected, use Mongoose model
		if (isMongooseConnected()) {
			try {
				const existingUser = await User.findOne({ email });
				if (existingUser) {
					return res.status(400).json({
						message: "An account with this email already exists.",
					});
				}

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
			} catch (dbErr) {
				console.warn("DB signup error, falling back to memory:", dbErr.message);
			}
		}

		// In-Memory Fallback
		const existingMemoryUser = memoryUsers.find((u) => u.email === email);
		if (existingMemoryUser) {
			return res.status(400).json({
				message: "An account with this email already exists.",
			});
		}

		const newUserId = new mongoose.Types.ObjectId().toString();
		const newMemoryUser = {
			_id: newUserId,
			name,
			email,
			password: pwHash,
			books: [],
			createdAt: new Date().toISOString(),
		};

		memoryUsers.push(newMemoryUser);

		const token = jwt.sign({ id: newUserId }, JWT_SECRET, {
			expiresIn: "7d",
		});

		const { password: _, ...userSafe } = newMemoryUser;
		return res.status(201).json({
			message: "User registered successfully",
			user: userSafe,
			token,
		});
	} catch (error) {
		console.error("Signup error:", error.message);
		return res
			.status(500)
			.json({ message: error.message || "Registration failed" });
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

		// If MongoDB is connected, use Mongoose model
		if (isMongooseConnected()) {
			try {
				const user = await User.findOne({ email });
				if (user) {
					const isMatch = await bcrypt.compare(password, user.password);
					if (!isMatch) {
						return res
							.status(400)
							.json({ message: "Invalid email or password." });
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
				}
			} catch (dbErr) {
				console.warn("DB login error, falling back to memory:", dbErr.message);
			}
		}

		// In-Memory Fallback
		const memoryUser = memoryUsers.find((u) => u.email === email);
		if (!memoryUser) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const isMatch = await bcrypt.compare(password, memoryUser.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const token = jwt.sign({ id: memoryUser._id }, JWT_SECRET, {
			expiresIn: "7d",
		});

		const { password: _, ...userSafe } = memoryUser;
		return res.status(200).json({
			message: "Login successful",
			user: userSafe,
			token,
		});
	} catch (error) {
		console.error("Login error:", error.message);
		return res
			.status(500)
			.json({ message: error.message || "Login failed" });
	}
});

export default router;
