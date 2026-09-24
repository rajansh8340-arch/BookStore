import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { JWT_SECRET } from "../config.js";

const router = express.Router();

// Helper to generate default 2-page paragraphs from description/title if empty
const buildSamplePages = (title, author, description, customPages) => {
	if (
		customPages &&
		customPages.page1 &&
		customPages.page1.paragraphs &&
		customPages.page1.paragraphs.length > 0
	) {
		return {
			page1: {
				chapterTitle:
					customPages.page1.chapterTitle || `Chapter I: The World of ${title}`,
				paragraphs: customPages.page1.paragraphs.filter(Boolean),
			},
			page2: {
				chapterTitle:
					customPages.page2?.chapterTitle || "Chapter I: Continuation",
				paragraphs:
					customPages.page2?.paragraphs?.filter(Boolean) || [
						"The journey through the pages begins here, unfolding adventures, reflections, and captivating narratives that resonate deeply with every reader.",
					],
			},
		};
	}

	const descSentences = (description || "")
		.split(/(?<=[.?!])\s+/)
		.filter((s) => s.trim().length > 0);

	let p1Text = descSentences.slice(0, Math.ceil(descSentences.length / 2)).join(" ");
	let p2Text = descSentences.slice(Math.ceil(descSentences.length / 2)).join(" ");

	if (!p1Text) p1Text = description || "An enduring and magnificent literary tale.";
	if (!p2Text) {
		p2Text = `Written with unmistakable mastery by ${author || "the author"}, this work invites you to delve deeper into its profound narrative and timeless themes. Every sentence crafted within carries the distinct voice and vision of its creator.`;
	}

	return {
		page1: {
			chapterTitle: `Chapter 1: The Beginning of ${title}`,
			paragraphs: [
				p1Text,
				`Step into the world woven by ${author}. Here, every character has a destiny to uncover and every path leads to unexpected revelations.`,
			],
		},
		page2: {
			chapterTitle: "Chapter 1: Unfolding the Journey",
			paragraphs: [
				p2Text,
				"As the daylight waned into the quiet dusk, the true depth of the tale began to surface, revealing hidden mysteries and unforgettable moments.",
			],
		},
	};
};

// Route to post a book (Protected)
router.post("/", authMiddleware, async (req, res) => {
	try {
		const {
			title,
			author,
			publishYear,
			description,
			rating,
			genre,
			coverTheme,
			samplePages,
		} = req.body;

		if (
			!title ||
			!author ||
			publishYear === undefined ||
			publishYear === null ||
			!description
		) {
			return res.status(400).json({
				message:
					"Send all required fields: title, author, publishYear, description",
			});
		}

		const parsedYear = Number(publishYear);
		if (isNaN(parsedYear)) {
			return res.status(400).json({
				message: "publishYear must be a valid number",
			});
		}

		const parsedRating =
			rating !== undefined && rating !== null && !isNaN(Number(rating))
				? Math.min(5, Math.max(1, Number(rating)))
				: 4.8;

		const computedSamplePages = buildSamplePages(
			title.trim(),
			author.trim(),
			description.trim(),
			samplePages
		);

		const newBook = {
			title: title.trim(),
			author: author.trim(),
			publishYear: parsedYear,
			description: description.trim(),
			rating: parsedRating,
			ratingCount: 1,
			genre: genre?.trim() || "Classic Literature",
			coverTheme: coverTheme || "ocean",
			samplePages: computedSamplePages,
			ratings: [
				{
					userName: "First Reviewer",
					rating: parsedRating,
					review: "A wonderful addition to our library collection!",
				},
			],
		};

		const book = await Book.create(newBook);

		const user = await User.findById(req.user.id);
		if (user) {
			user.books.push(book._id);
			await user.save();
		}

		return res.status(201).json(book);
	} catch (error) {
		console.error("Create book error:", error.message);
		return res.status(400).json({
			message: error.message || "Failed to create book",
		});
	}
});

// Route to get all books
router.get("/", async (req, res) => {
	try {
		const { search, genre, sort, minRating } = req.query;
		let query = {};

		if (search) {
			const searchRegex = new RegExp(search, "i");
			query.$or = [
				{ title: searchRegex },
				{ author: searchRegex },
				{ genre: searchRegex },
			];
		}

		if (genre && genre !== "All") {
			query.genre = new RegExp(genre, "i");
		}

		let sortOptions = { createdAt: -1 };
		if (sort === "rating") {
			sortOptions = { rating: -1, ratingCount: -1 };
		} else if (sort === "year_desc") {
			sortOptions = { publishYear: -1 };
		} else if (sort === "year_asc") {
			sortOptions = { publishYear: 1 };
		} else if (sort === "title") {
			sortOptions = { title: 1 };
		}

		let books = await Book.find(query).sort(sortOptions).lean();

		// Ensure defaults for rating and samplePages
		books = books.map((b) => {
			const effectiveRating =
				b.rating !== undefined && b.rating !== null ? Number(b.rating) : 4.8;
			const effectiveCount =
				b.ratingCount !== undefined && b.ratingCount !== null
					? Number(b.ratingCount)
					: 35;
			const effectiveGenre = b.genre || "Classic Literature";

			let samplePages = b.samplePages;
			if (
				!samplePages ||
				!samplePages.page1 ||
				!samplePages.page1.paragraphs ||
				samplePages.page1.paragraphs.length === 0
			) {
				samplePages = buildSamplePages(
					b.title || "",
					b.author || "",
					b.description || "",
					null
				);
			}

			return {
				...b,
				rating: effectiveRating,
				ratingCount: effectiveCount,
				genre: effectiveGenre,
				samplePages,
			};
		});

		if (minRating && !isNaN(Number(minRating))) {
			books = books.filter((b) => b.rating >= Number(minRating));
		}

		return res.status(200).json({
			count: books.length,
			data: books,
		});
	} catch (error) {
		console.error("Get all books error:", error.message);
		return res
			.status(500)
			.json({ message: error.message || "Failed to fetch books" });
	}
});

// Route to get books by authenticated user (Protected)
router.get("/mybooks", authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate("books");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const userBooks = (user.books || []).filter(Boolean).map((b) => {
			const obj = b.toObject ? b.toObject() : b;
			if (obj.rating === undefined || obj.rating === null) obj.rating = 4.8;
			if (!obj.genre) obj.genre = "Classic Literature";
			return obj;
		});

		return res.status(200).json(userBooks);
	} catch (error) {
		console.error("Get my books error:", error.message);
		return res.status(500).json({ message: "Server error fetching user books" });
	}
});

// Route to rate a book (supports POST /:id/rate and PUT /:id/rate)
const handleRateBook = async (req, res) => {
	try {
		const { id } = req.params;
		const { rating, review, userName } = req.body;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid book ID format" });
		}

		const numRating = Number(rating);
		if (isNaN(numRating) || numRating < 1 || numRating > 5) {
			return res
				.status(400)
				.json({ message: "Rating must be a number between 1 and 5" });
		}

		const book = await Book.findById(id);
		if (!book) {
			return res.status(404).json({ message: "Book not found" });
		}

		// Check if request has auth token
		let userObj = null;
		const authHeader = req.header("Authorization");
		if (authHeader) {
			const token = authHeader.startsWith("Bearer ")
				? authHeader.slice(7).trim()
				: authHeader;
			try {
				const decoded = jwt.verify(token, JWT_SECRET);
				userObj = await User.findById(decoded.id);
			} catch (tErr) {
				// Ignore invalid token
			}
		}

		const finalUserName =
			userObj?.name || userName?.trim() || "Fellow Reader";

		const newReview = {
			userId: userObj ? userObj._id : undefined,
			userName: finalUserName,
			rating: numRating,
			review: review?.trim() || "Rated this book.",
			createdAt: new Date(),
		};

		if (!Array.isArray(book.ratings)) {
			book.ratings = [];
		}
		book.ratings.unshift(newReview);

		// Calculate updated average
		const currentCount = Number(book.ratingCount) || 1;
		const currentRating = Number(book.rating) || 4.5;
		const newCount = currentCount + 1;
		const newRating =
			Math.round(((currentRating * currentCount + numRating) / newCount) * 10) /
			10;

		book.rating = newRating;
		book.ratingCount = newCount;

		await book.save();

		const bookObj = book.toObject();
		if (
			!bookObj.samplePages ||
			!bookObj.samplePages.page1 ||
			!bookObj.samplePages.page1.paragraphs ||
			bookObj.samplePages.page1.paragraphs.length === 0
		) {
			bookObj.samplePages = buildSamplePages(
				bookObj.title || "",
				bookObj.author || "",
				bookObj.description || "",
				null
			);
		}

		return res.status(200).json({
			message: "Thank you! Your rating has been recorded.",
			rating: book.rating,
			ratingCount: book.ratingCount,
			data: bookObj,
		});
	} catch (error) {
		console.error("Rate book error:", error.message);
		return res
			.status(500)
			.json({ message: error.message || "Failed to submit rating" });
	}
};

router.post("/:id/rate", handleRateBook);
router.put("/:id/rate", handleRateBook);

// Route to get single book with id
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid book ID format" });
		}

		const book = await Book.findById(id).lean();
		if (!book) {
			return res.status(404).json({ message: "Book not found" });
		}

		if (book.rating === undefined || book.rating === null) {
			book.rating = 4.8;
		}
		if (book.ratingCount === undefined || book.ratingCount === null) {
			book.ratingCount = 45;
		}
		if (!book.genre) {
			book.genre = "Classic Literature";
		}
		if (
			!book.samplePages ||
			!book.samplePages.page1 ||
			!book.samplePages.page1.paragraphs ||
			book.samplePages.page1.paragraphs.length === 0
		) {
			book.samplePages = buildSamplePages(
				book.title || "",
				book.author || "",
				book.description || "",
				null
			);
		}

		return res.status(200).json(book);
	} catch (error) {
		console.error("Get book by ID error:", error.message);
		return res
			.status(500)
			.json({ message: error.message || "Failed to fetch book" });
	}
});

// Route to update a book
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid book ID format" });
		}

		const {
			title,
			author,
			publishYear,
			description,
			rating,
			genre,
			coverTheme,
			samplePages,
		} = req.body;

		if (
			!title ||
			!author ||
			publishYear === undefined ||
			publishYear === null ||
			!description
		) {
			return res.status(400).json({
				message:
					"Send all required fields: title, author, publishYear, description",
			});
		}

		const parsedYear = Number(publishYear);
		if (isNaN(parsedYear)) {
			return res.status(400).json({
				message: "publishYear must be a valid number",
			});
		}

		const updatedData = {
			title: title.trim(),
			author: author.trim(),
			publishYear: parsedYear,
			description: description.trim(),
		};

		if (rating !== undefined && !isNaN(Number(rating))) {
			updatedData.rating = Math.min(5, Math.max(1, Number(rating)));
		}

		if (genre) updatedData.genre = genre.trim();
		if (coverTheme) updatedData.coverTheme = coverTheme;

		if (samplePages) {
			updatedData.samplePages = buildSamplePages(
				title.trim(),
				author.trim(),
				description.trim(),
				samplePages
			);
		}

		const result = await Book.findByIdAndUpdate(id, updatedData, {
			new: true,
			runValidators: true,
		});

		if (!result) {
			return res.status(404).json({ message: "Book not found." });
		}

		return res.status(200).json({
			message: "Book updated successfully.",
			data: result,
		});
	} catch (error) {
		console.error("Update book error:", error.message);
		return res
			.status(500)
			.json({ message: error.message || "Failed to update book" });
	}
});

// Route to delete a book
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid book ID format" });
		}

		const result = await Book.findByIdAndDelete(id);

		if (!result) {
			return res.status(404).json({ message: "Book not found." });
		}

		await User.updateMany({ books: id }, { $pull: { books: id } });

		return res.status(200).json({ message: "Book deleted successfully." });
	} catch (error) {
		console.error("Delete book error:", error.message);
		return res
			.status(500)
			.json({ message: error.message || "Failed to delete book" });
	}
});

export default router;
