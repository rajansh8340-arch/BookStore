import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { JWT_SECRET } from "../config.js";
import { memoryBooks, memoryUsers, isMongooseConnected } from "../dataStore.js";

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

		const newBookData = {
			_id: new mongoose.Types.ObjectId().toString(),
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
					createdAt: new Date(),
				},
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Always record to in-memory store
		memoryBooks.unshift(newBookData);

		// Record in memory user
		const mUser = memoryUsers.find((u) => u._id === req.user.id);
		if (mUser) {
			mUser.books.push(newBookData._id);
		}

		// If DB is connected, save to MongoDB as well
		if (isMongooseConnected()) {
			try {
				const book = await Book.create(newBookData);
				const user = await User.findById(req.user.id);
				if (user) {
					user.books.push(book._id);
					await user.save();
				}
				return res.status(201).json(book);
			} catch (dbErr) {
				console.warn("DB create book error:", dbErr.message);
			}
		}

		return res.status(201).json(newBookData);
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

		// 1. Try fetching from MongoDB if connected
		if (isMongooseConnected()) {
			try {
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

				if (books && books.length > 0) {
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
				}
			} catch (dbErr) {
				console.warn("DB fetch books error, falling back to memory store:", dbErr.message);
			}
		}

		// 2. In-Memory Store Fallback (Guaranteed fast 200 response)
		let result = [...memoryBooks];

		if (search) {
			const s = search.toLowerCase();
			result = result.filter(
				(b) =>
					b.title?.toLowerCase().includes(s) ||
					b.author?.toLowerCase().includes(s) ||
					b.genre?.toLowerCase().includes(s)
			);
		}

		if (genre && genre !== "All") {
			result = result.filter((b) =>
				b.genre?.toLowerCase().includes(genre.toLowerCase())
			);
		}

		if (minRating && !isNaN(Number(minRating))) {
			result = result.filter((b) => (b.rating || 4.8) >= Number(minRating));
		}

		if (sort === "rating") {
			result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
		} else if (sort === "year_desc") {
			result.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
		} else if (sort === "year_asc") {
			result.sort((a, b) => (a.publishYear || 0) - (b.publishYear || 0));
		} else if (sort === "title") {
			result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
		}

		return res.status(200).json({
			count: result.length,
			data: result,
		});
	} catch (error) {
		console.error("Get all books error:", error.message);
		return res.status(200).json({
			count: memoryBooks.length,
			data: memoryBooks,
		});
	}
});

// Route to get books by authenticated user (Protected)
router.get("/mybooks", authMiddleware, async (req, res) => {
	try {
		if (isMongooseConnected()) {
			try {
				const user = await User.findById(req.user.id).populate("books");
				if (user) {
					const userBooks = (user.books || []).filter(Boolean).map((b) => {
						const obj = b.toObject ? b.toObject() : b;
						if (obj.rating === undefined || obj.rating === null) obj.rating = 4.8;
						if (!obj.genre) obj.genre = "Classic Literature";
						return obj;
					});
					return res.status(200).json(userBooks);
				}
			} catch (dbErr) {
				console.warn("DB mybooks error:", dbErr.message);
			}
		}

		const mUser = memoryUsers.find((u) => u._id === req.user.id);
		if (!mUser) {
			return res.status(200).json([]);
		}

		const userBooks = memoryBooks.filter((b) =>
			(mUser.books || []).includes(b._id)
		);
		return res.status(200).json(userBooks);
	} catch (error) {
		console.error("Get my books error:", error.message);
		return res.status(200).json([]);
	}
});

// Route to rate a book (supports POST /:id/rate and PUT /:id/rate)
const handleRateBook = async (req, res) => {
	try {
		const { id } = req.params;
		const { rating, review, userName } = req.body;

		const numRating = Number(rating);
		if (isNaN(numRating) || numRating < 1 || numRating > 5) {
			return res
				.status(400)
				.json({ message: "Rating must be a number between 1 and 5" });
		}

		// Find book in memory
		let memBook = memoryBooks.find((b) => String(b._id) === String(id));

		let userObj = null;
		const authHeader = req.header("Authorization");
		if (authHeader) {
			const token = authHeader.startsWith("Bearer ")
				? authHeader.slice(7).trim()
				: authHeader;
			try {
				const decoded = jwt.verify(token, JWT_SECRET);
				userObj = memoryUsers.find((u) => u._id === decoded.id) || null;
				if (!userObj && isMongooseConnected()) {
					userObj = await User.findById(decoded.id);
				}
			} catch (tErr) {
				// Ignore
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

		// 1. If DB is connected, update DB
		if (isMongooseConnected()) {
			try {
				if (mongoose.Types.ObjectId.isValid(id)) {
					const dbBook = await Book.findById(id);
					if (dbBook) {
						if (!Array.isArray(dbBook.ratings)) {
							dbBook.ratings = [];
						}
						dbBook.ratings.unshift(newReview);

						const currentCount = Number(dbBook.ratingCount) || 1;
						const currentRating = Number(dbBook.rating) || 4.5;
						const newCount = currentCount + 1;
						const newRating =
							Math.round(
								((currentRating * currentCount + numRating) / newCount) * 10
							) / 10;

						dbBook.rating = newRating;
						dbBook.ratingCount = newCount;

						await dbBook.save();

						const bookObj = dbBook.toObject();
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

						// Also sync with memory
						if (memBook) {
							memBook.rating = newRating;
							memBook.ratingCount = newCount;
							if (!Array.isArray(memBook.ratings)) memBook.ratings = [];
							memBook.ratings.unshift(newReview);
						}

						return res.status(200).json({
							message: "Thank you! Your rating has been recorded.",
							rating: dbBook.rating,
							ratingCount: dbBook.ratingCount,
							data: bookObj,
						});
					}
				}
			} catch (dbErr) {
				console.warn("DB rate error, falling back to memory:", dbErr.message);
			}
		}

		// 2. Memory Store Fallback
		if (!memBook) {
			return res.status(404).json({ message: "Book not found" });
		}

		if (!Array.isArray(memBook.ratings)) {
			memBook.ratings = [];
		}
		memBook.ratings.unshift(newReview);

		const currentCount = Number(memBook.ratingCount) || 1;
		const currentRating = Number(memBook.rating) || 4.5;
		const newCount = currentCount + 1;
		const newRating =
			Math.round(((currentRating * currentCount + numRating) / newCount) * 10) / 10;

		memBook.rating = newRating;
		memBook.ratingCount = newCount;
		memBook.updatedAt = new Date().toISOString();

		return res.status(200).json({
			message: "Thank you! Your rating has been recorded.",
			rating: memBook.rating,
			ratingCount: memBook.ratingCount,
			data: memBook,
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

		// 1. Try MongoDB
		if (isMongooseConnected()) {
			try {
				if (mongoose.Types.ObjectId.isValid(id)) {
					const book = await Book.findById(id).lean();
					if (book) {
						if (book.rating === undefined || book.rating === null) book.rating = 4.8;
						if (book.ratingCount === undefined || book.ratingCount === null)
							book.ratingCount = 45;
						if (!book.genre) book.genre = "Classic Literature";
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
					}
				}
			} catch (dbErr) {
				console.warn("DB findById error:", dbErr.message);
			}
		}

		// 2. Memory Store Fallback
		const memBook = memoryBooks.find((b) => String(b._id) === String(id));
		if (!memBook) {
			return res.status(404).json({ message: "Book not found" });
		}

		return res.status(200).json(memBook);
	} catch (error) {
		console.error("Get book by ID error:", error.message);
		const fallback = memoryBooks.find((b) => String(b._id) === String(req.params.id));
		if (fallback) return res.status(200).json(fallback);
		return res
			.status(500)
			.json({ message: error.message || "Failed to fetch book" });
	}
});

// Route to update a book
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
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
			updatedAt: new Date().toISOString(),
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

		// Update memory store
		const memIdx = memoryBooks.findIndex((b) => String(b._id) === String(id));
		if (memIdx !== -1) {
			memoryBooks[memIdx] = { ...memoryBooks[memIdx], ...updatedData };
		}

		// Update DB if connected
		if (isMongooseConnected()) {
			try {
				if (mongoose.Types.ObjectId.isValid(id)) {
					const result = await Book.findByIdAndUpdate(id, updatedData, {
						new: true,
						runValidators: true,
					});
					if (result) {
						return res.status(200).json({
							message: "Book updated successfully.",
							data: result,
						});
					}
				}
			} catch (dbErr) {
				console.warn("DB update error:", dbErr.message);
			}
		}

		if (memIdx !== -1) {
			return res.status(200).json({
				message: "Book updated successfully.",
				data: memoryBooks[memIdx],
			});
		}

		return res.status(404).json({ message: "Book not found." });
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

		// Delete from memory
		const memIdx = memoryBooks.findIndex((b) => String(b._id) === String(id));
		if (memIdx !== -1) {
			memoryBooks.splice(memIdx, 1);
		}

		if (isMongooseConnected()) {
			try {
				if (mongoose.Types.ObjectId.isValid(id)) {
					await Book.findByIdAndDelete(id);
					await User.updateMany({ books: id }, { $pull: { books: id } });
				}
			} catch (dbErr) {
				console.warn("DB delete error:", dbErr.message);
			}
		}

		return res.status(200).json({ message: "Book deleted successfully." });
	} catch (error) {
		console.error("Delete book error:", error.message);
		return res
			.status(500)
			.json({ message: error.message || "Failed to delete book" });
	}
});

export default router;
