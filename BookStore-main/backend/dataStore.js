import mongoose from "mongoose";
import booksSeed from "./seedBooks.js";

// Deterministic 24-hex ObjectId generator for seed books
const generateObjectId = (index) => {
	const hex = (index + 1).toString(16).padStart(24, "0");
	return hex;
};

// Initialize in-memory books from seed data
export const memoryBooks = booksSeed.map((book, index) => ({
	_id: generateObjectId(index),
	title: book.title,
	author: book.author,
	publishYear: book.publishYear,
	genre: book.genre || "Classic Literature",
	rating: book.rating || 4.8,
	ratingCount: book.ratingCount || 100,
	coverTheme: book.coverTheme || "ocean",
	description: book.description,
	samplePages: book.samplePages || {
		page1: {
			chapterTitle: `Chapter 1: The World of ${book.title}`,
			paragraphs: [book.description],
		},
		page2: {
			chapterTitle: "Chapter 1: Continuation",
			paragraphs: [
				"Every journey in literature holds a profound secret waiting to be unraveled by the keen reader.",
			],
		},
	},
	ratings: book.ratings || [
		{
			userName: "Verified Reader",
			rating: book.rating || 4.8,
			review: "A timeless masterpiece.",
			createdAt: new Date(),
		},
	],
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
}));

// In-memory user store
export const memoryUsers = [];

// Check if MongoDB connection is alive
export const isMongooseConnected = () => {
	return mongoose.connection.readyState === 1;
};
