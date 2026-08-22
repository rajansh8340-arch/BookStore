import express from "express";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to post a book
router.post("/", authMiddleware, async (req, res) => {
	try {
		if (
			!req.body.title ||
			!req.body.author ||
			!req.body.publishYear ||
			!req.body.description
		) {
			return res.status(400).send({
				message:
					"Send all required fields: title, author, publishYear, description",
			});
		}

		const newBook = {
			title: req.body.title,
			author: req.body.author,
			publishYear: req.body.publishYear,
			description: req.body.description,
		};

		const book = await Book.create(newBook);

		const user = await User.findById(req.user.id);
		user.books.push(book._id);
		await user.save();

		return res.status(201).send(book);
	} catch (error) {
		console.log(error.message);
		return res.status(400).send({
			message: error.message,
		});
	}
});

// Route to get all books
router.get("/", async (req, res) => {
	try {
		const books = await Book.find({});
		return res.status(200).json({
			count: books.length,
			data: books,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ message: error.message });
	}
});

// Route to get books by user
router.get("/mybooks", authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate("books");
		if (!user || user.books.length === 0) {
			return res.status(404).json({ message: "No books found for this user" });
		}

		res.status(200).json(user.books);
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ message: "Server error" });
	}
});

// Route to get single book with id
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const book = await Book.findById(id);
		return res.status(200).json(book);
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ message: error.message });
	}
});

// Route to update a book
router.put("/:id", async (req, res) => {
	try {
		if (
			!req.body.title ||
			!req.body.author ||
			!req.body.publishYear ||
			!req.body.description
		) {
			return res.status(400).send({
				message:
					"Send all required fields: title, author, publishYear, description",
			});
		}

		const { id } = req.params;

		const result = await Book.findByIdAndUpdate(id, req.body);

		if (!result) {
			return res.status(404).json({ message: "Book not found." });
		}

		return res.status(200).json({ message: "Book updated successfully." });
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ message: error.message });
	}
});

// Route to delete a book
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const result = await Book.findByIdAndDelete(id);

		if (!result) {
			return res.status(404).json({ message: "Book not found." });
		}

		return res.status(200).json({ message: "Book deleted successfully." });
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ message: error.message });
	}
});

export default router;
