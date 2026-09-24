import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		userName: {
			type: String,
			default: "Book Enthusiast",
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		review: {
			type: String,
			trim: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: true }
);

const samplePageSchema = mongoose.Schema(
	{
		chapterTitle: {
			type: String,
			default: "Chapter I",
		},
		paragraphs: [
			{
				type: String,
			},
		],
	},
	{ _id: false }
);

const bookSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		author: {
			type: String,
			required: true,
			trim: true,
		},
		publishYear: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		rating: {
			type: Number,
			default: 4.5,
			min: 0,
			max: 5,
		},
		ratingCount: {
			type: Number,
			default: 1,
		},
		genre: {
			type: String,
			default: "Classic Literature",
			trim: true,
		},
		coverTheme: {
			type: String,
			default: "ocean",
		},
		samplePages: {
			page1: {
				type: samplePageSchema,
				default: () => ({
					chapterTitle: "Chapter I: Opening",
					paragraphs: [],
				}),
			},
			page2: {
				type: samplePageSchema,
				default: () => ({
					chapterTitle: "Chapter I: Continuation",
					paragraphs: [],
				}),
			},
		},
		ratings: [reviewSchema],
	},
	{
		timestamps: true,
	}
);

export const Book = mongoose.model("Book", bookSchema);
