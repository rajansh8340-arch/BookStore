import express from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
	try {
		let { name, email, password } = req.body;

		const salt = await bcrypt.genSalt(10);
		const pwHash = await bcrypt.hash(password, salt);

		const newUser = new User({ name, email, password: pwHash });
		const savedUser = await newUser.save();

		const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

		const { password: userPassword, ...userWithoutPassword } = savedUser._doc;
		res.status(201).json({ user: userWithoutPassword, token });
	} catch (error) {
		res.status(500).json({ err: error.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		let { email, password } = req.body;
		const user = await User.findOne({ email: email });
		if (!user) return res.status(400).json({ msg: "User does not exist." });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

		const { password: userPassword, ...userWithoutPassword } = user._doc;
		res.status(200).json({ user: userWithoutPassword, token });
	} catch (error) {
		res.status(500).json({ err: error.message });
	}
});

export default router;
